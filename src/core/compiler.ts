import path from "node:path";
import { bold, gray, green, red, reset } from "yoctocolors";
import {
	createScadLogger,
	createSilentLogger,
	Debug,
	exists,
	resolveOpenSCAD,
} from "../lib";
import * as cache from "./cache";
import { DOT_SCAD, DOT_STL, PLUGIN_NAME, SCAD_EXT } from "./const";
import { parseScadFileFrontMatter } from "./frontmatter";
import { OpenSCAD } from "./openscad";
import type {
	EleventyConfig,
	EleventyDirs,
	FullPageData,
	ParsedPluginOptions,
	ScadTemplateData,
} from "../types";

const debug = Debug.extend("compiler");

/**
 * Eleventy Plugin for OpenSCAD
 *
 * @param {EleventyConfig} eleventyConfig
 * @param {PluginOptionsInput} options
 */
export function addScadExtensionHandler(
	eleventyConfig: EleventyConfig,
	{ launchPath, ...opts }: ParsedPluginOptions,
) {
	const log = createScadLogger(eleventyConfig);
	const _log = createSilentLogger(log, opts.silent);

	let resolvedScadBin: string | undefined | null = launchPath;

	if (opts.resolveLaunchPath) {
		resolvedScadBin = resolveOpenSCAD(launchPath);
		if (resolvedScadBin === null) {
			const message = `The launchPath "${launchPath}" does not exist.`;
			log(red(message));
			throw new Error(message);
		}
	}

	eleventyConfig.addTemplateFormats(SCAD_EXT);
	eleventyConfig.addExtension(SCAD_EXT, {
		// #region getData
		/**
		 * Data provided to the layout & page of a `.scad` file template
		 */
		async getData(inputPath: string) {
			const filename = path.basename(inputPath);
			const rendererSettings = parseScadFileFrontMatter(inputPath);
			const data = {
				title: filename,
				slug: filename.replace(DOT_SCAD, ""),
				scadFile: inputPath,
				stlFile: filename.replace(DOT_SCAD, DOT_STL),
				layout: opts.layout,
				theme: opts.theme,
				tags: [SCAD_EXT],
				renderer: rendererSettings.content ?? {},
			} satisfies ScadTemplateData;
			debug("data for: %o", inputPath);
			debug(data);
			return data;
		},
		// #endregion

		// #region compile
		/**
		 * Compile `.scad` files into `.stl` & `.png`
		 */
		async compile(inputContent: string, inputPath: string) {
			debug("compiling %O", inputPath);

			if (opts.noSTL) {
				return async (data: FullPageData) => {
					debug("noSTL is set; returning bare render function.");
					_log(
						`${gray("Skipping write of")} ${reset(data.stlFile)} ${gray(`from ${inputPath}`)}`,
					);
					return inputContent;
				};
			}

			return async (data: FullPageData) => {
				debug("rendering %O", inputPath);

				try {
					if (!data.page.url) {
						throw new Error(
							`${inputPath} must have "permalink:true" set in the frontmatter`,
						);
						// return inputContent;
					}

					// @ts-expect-error this does exist but the types in 11ty.ts have `serverless` still
					const elevenDirs = data.eleventy.directories as EleventyDirs;
					const projectRoot = data.eleventy.env.root;

					const outputStem = path.relative(projectRoot, elevenDirs.output);

					/** `.scad` source */
					const inFile = path.relative(projectRoot, data.page.inputPath);

					/** `.stl` target */
					const outFile = path
						.join(outputStem, data.page.url, data.stlFile)
						.replace(/^\//, "");

					// md5 the contents of the file for caching
					await cache.ensureFileRegistered(inFile);

					const stlExists = exists(outFile);

					// @TODO can this be replaced with `inputContent`????
					const hashMatch = await cache.fileHashesMatch(inFile);

					if (!stlExists || !hashMatch) {
						_log(
							`${reset("Writing")} ${data.stlFile} ${gray(`from ${inputPath}`)}`,
						);

						debug("pre-generate: %O", {
							inFile,
							outFile,
							projectRoot,
							stlExists,
							hashMatch,
						});

						const openscad = OpenSCAD.create({
							cwd: projectRoot,
							in: inFile,
							out: outFile,
							colorscheme: opts.thumbnailColorScheme,
						});

						const exportResult = await openscad.export(resolvedScadBin);

						if (!exportResult.ok) {
							log(red("OpenSCAD encountered an issue"));
							for (const line of exportResult.output) {
								const cleanLine = line.replaceAll("\n", "");
								log(red(cleanLine));
							}
							return inputContent;
						}

						cache.updateHash(inFile);

						// log what OpenSCAD output during rendering
						if (opts.verbose) {
							const lines = exportResult.output.flatMap((l) => l.split("\n"));
							for (const line of lines) {
								_log(gray(`\t${line}`));
							}
						}

						const duration = exportResult.duration.toFixed(2);
						_log(
							green(`Wrote ${bold(data.stlFile)} in ${bold(duration)} seconds`),
						);
					} else {
						debug("%o is up to date; skipped", path.basename(outFile));
					}
				} catch (e) {
					const err = e as Error;
					console.error(`[${PLUGIN_NAME}] ERR ${err.message}`);
				}

				return inputContent;
			};
		},
	});
	// #endregion
}
