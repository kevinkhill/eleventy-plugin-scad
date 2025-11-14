import path from "node:path";
import { blue, bold, cyan, gray, green, red, reset } from "yoctocolors";
import { prettifyError } from "zod";
import { DEFAULT_PLUGIN_THEME } from "./config";
import {
	addBuiltinScadLayoutVirtualTemplate,
	addScadCollectionVirtualTemplate,
	addShortcodes,
	cache,
	parseOptions,
	scad2stl,
} from "./core";
import {
	DEFAULT_SCAD_LAYOUT,
	DOT_SCAD,
	DOT_STL,
	PLUGIN_NAME,
	SCAD_EXT,
} from "./core/const";
import { ensureAssetPath } from "./lib/assets";
import Debug from "./lib/debug";
import { exists } from "./lib/fs";
import { createScadLogger } from "./lib/logger";
import { resolveOpenSCAD } from "./lib/resolve";
import type {
	EleventyConfig,
	EleventyDirs,
	FullPageData,
	PluginOptionsInput,
	ScadTemplateData,
} from "./types";

const debug = Debug.extend("core");

/**
 * Eleventy Plugin for OpenSCAD
 *
 * @param {EleventyConfig} eleventyConfig
 * @param {PluginOptionsInput} options
 */
export function EleventyPluginOpenSCAD(
	eleventyConfig: EleventyConfig,
	options: PluginOptionsInput,
) {
	try {
		if (!("addTemplate" in eleventyConfig)) {
			throw new Error(
				`Virtual Templates are required for this plugin, please use Eleventy v3.0 or newer.`,
			);
		}
	} catch (e) {
		console.log(
			`[${PLUGIN_NAME}] WARN Eleventy plugin compatibility: ${(e as Error).message}`,
		);
	}

	ensureAssetPath();
	const log = createScadLogger(eleventyConfig);

	// #region Parse Options
	const parsedOptions = parseOptions(options);

	if (parsedOptions.error) {
		const message = prettifyError(parsedOptions.error);
		log(red(message));
		throw new Error(message);
	}

	const {
		theme,
		noSTL,
		layout,
		silent,
		verbose,
		launchPath,
		collectionPage,
		resolveLaunchPath,
	} = parsedOptions.data;
	// #endregion

	/** logger that can be silenced */
	const _log = (it: string) => {
		if (!silent) log(it);
	};

	// #region Check Bin Path
	let resolvedScadBin: string | undefined | null = launchPath;

	if (resolveLaunchPath) {
		resolvedScadBin = resolveOpenSCAD(launchPath);
		if (resolvedScadBin === null) {
			const message = `The launchPath "${launchPath}" does not exist.`;
			log(red(message));
			throw new Error(message);
		}
	}
	// #endregion

	// #region Log Set Options
	_log(`${gray("Theme:")} ${reset(theme)}`);
	_log(
		`${gray("Spawn:")} ${(launchPath === "docker" ? cyan : blue)(String(launchPath))}`,
	);
	_log(
		[
			gray(" Opts:"),
			silent ? green("+silent") : "",
			verbose ? green("+verbose") : "",
			noSTL ? red("-noSTL") : "",
			!resolveLaunchPath ? red("-resolveLaunchPath") : "",
			!collectionPage ? red("-collectionPage") : "",
		]
			.join(" ")
			.replaceAll(/\s+/g, " "),
	);
	// #endregion

	// #region Plugin Body
	addShortcodes(eleventyConfig);

	// Default renderer for `.scad` files once turned into HTML
	addBuiltinScadLayoutVirtualTemplate(eleventyConfig);

	// Add template file that lists all the collected `.scad` files
	if (collectionPage) {
		addScadCollectionVirtualTemplate(eleventyConfig);
	}

	/**
	 * Register `.scad` files as virtual template files and
	 * define they are to be compiled into html & stl files.
	 */
	eleventyConfig.addTemplateFormats(SCAD_EXT);
	eleventyConfig.addExtension(SCAD_EXT, {
		// #region getData
		/**
		 * Data provided to the layout & page of a `.scad` file template
		 */
		getData(inputPath: string) {
			const filename = path.basename(inputPath);
			const data: ScadTemplateData = {
				title: filename,
				slug: filename.replace(DOT_SCAD, ""),
				scadFile: inputPath,
				stlFile: filename.replace(DOT_SCAD, DOT_STL),
				layout: layout ?? DEFAULT_SCAD_LAYOUT,
				theme: theme ?? DEFAULT_PLUGIN_THEME,
				tags: [SCAD_EXT],
			};
			debug.extend("getData")({ inputPath, data });
			return data;
		},
		// #endregion
		// #region compile
		/**
		 * Compile `.scad` files into `.stl`
		 */
		async compile(inputContent: string, inputPath: string) {
			return async (data: FullPageData) => {
				try {
					if (noSTL) {
						_log(
							`${cyan("Would write")} ${data.stlFile} ${gray(`from ${inputPath}`)}`,
						);
						return inputContent;
					}

					// @ts-expect-error this does exist but the types in 11ty.ts have `serverless` still
					const elevenDirs = data.eleventy.directories as EleventyDirs;

					// const projectRoot = path.resolve(dirs.output, "..");
					const projectRoot = data.eleventy.env.root;

					/** `.scad` source */
					// const inFile = path.resolve(projectRoot, data.scadFile);
					const inFile = path.relative(projectRoot, data.page.inputPath);

					const stlOutputDir = path.relative(
						projectRoot,
						path.join(elevenDirs.output, data.page.fileSlug),
					);
					/** `.stl` target */
					const outFile = path.join(stlOutputDir, data.stlFile);

					// md5 the contents of the file for caching
					await cache.ensureFileRegistered(inFile);

					const stlExists = exists(outFile);
					const hashesDiffer = await cache.fileHashesDiffer(inFile);

					debug.extend("compile")({
						inFile,
						outFile,
						projectRoot,
						pageData: data.page,
						stlExists,
						hashesDiffer,
					});

					if (!stlExists || hashesDiffer) {
						_log(
							`${reset("Writing")} ${data.stlFile} ${gray(`from ${inputPath}`)}`,
						);

						const scadResult = await scad2stl(String(resolvedScadBin), {
							cwd: projectRoot,
							in: inFile,
							out: outFile,
						});

						if (!scadResult.ok) {
							log(red("OpenSCAD encountered an issue"));
							for (const line of scadResult.output) {
								const cleanLine = line.replaceAll("\n", "");
								log(red(cleanLine));
							}
							return inputContent;
						}

						cache.updateHash(inFile);

						// log what OpenSCAD output during rendering
						if (verbose) {
							const lines = scadResult.output.flatMap((l) => l.split("\n"));
							for (const line of lines) {
								_log(gray(`\t${line}`));
							}
						}

						const duration = scadResult.duration.toFixed(2);
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
