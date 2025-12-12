import path from "node:path";
import { bold, gray, green, red, reset } from "yoctocolors";
import { cache, scadExporter } from "../core";
import { DOT_SCAD, DOT_STL, PLUGIN_NAME, SCAD_EXT } from "../core/const";
import {
	createScadLogger,
	createSilentLogger,
	Debug,
	exists,
	resolveOpenSCAD,
} from "../lib";
import type {
	EleventyConfig,
	EleventyDirs,
	Files,
	FullPageData,
	ParsedPluginOptions,
	ScadTemplateData,
} from "../types";

const debug = Debug.extend("extension");

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
	debug("registered .scad as extension for templates");

	eleventyConfig.addExtension(SCAD_EXT, {
		// #region getData
		/**
		 * Data provided to the layout & page of a `.scad` file template
		 */
		getData(inputPath: string) {
			const filename = path.basename(inputPath);
			return {
				title: filename,
				slug: filename.replace(DOT_SCAD, ""),
				scadFile: inputPath,
				stlFile: filename.replace(DOT_SCAD, DOT_STL),
				layout: opts.layout,
				theme: opts.theme,
				tags: [SCAD_EXT],
			} satisfies ScadTemplateData;
		},
		// #endregion
		// #region compile
		/**
		 * Compile `.scad` files into `.stl` & `.png`
		 */
		async compile(inputContent: string, inputPath: string) {
			return async (data: FullPageData) => {
				debug.extend("compile")("begin %O", { inputPath, data });
				try {
					if (opts.noSTL) {
						_log(
							`${gray("Skipping write of")} ${reset(data.stlFile)} ${gray(`from ${inputPath}`)}`,
						);
						return inputContent;
					}

					if (!data.page.url) {
						throw new Error(
							`${inputPath} must have "parmalink:true" set in the frontmatter`,
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
					const hashMatch = await cache.fileHashesMatch(inFile);

					debug.extend("compile")("pre-generate: %O", {
						inFile,
						outFile,
						projectRoot,
						stlExists,
						hashMatch,
					});

					if (!stlExists || !hashMatch) {
						_log(
							`${reset("Writing")} ${data.stlFile} ${gray(`from ${inputPath}`)}`,
						);

						const exportResult = await scadExporter(String(resolvedScadBin), {
							cwd: projectRoot,
							in: inFile,
							out: outFile,
						});

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
