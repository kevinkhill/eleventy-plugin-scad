import path from "node:path";
import { blue, bold, cyan, gray, green, red, reset } from "yoctocolors";
import { prettifyError } from "zod";
import {
	addScadCollectionVirtualTemplate,
	addShortcodes,
	addTemplateFromAsset,
	cache,
	parseOptions,
	scad2stl,
} from "./core";
import {
	DOT_SCAD,
	DOT_STL,
	PLUGIN_NAME,
	SCAD_COLLECTION_LAYOUT,
	SCAD_EXT,
	SCAD_VIEWER_LAYOUT,
} from "./core/const";
import { createScadLogger, Debug, exists, resolveOpenSCAD } from "./lib";
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
	addShortcodes(eleventyConfig, { theme });

	// Common themeable pages
	addTemplateFromAsset(eleventyConfig, "scad.base.njk");

	// Default renderer for `.scad` files once turned into HTML
	addTemplateFromAsset(eleventyConfig, SCAD_VIEWER_LAYOUT);

	if (collectionPage) {
		// Add template that lists all the collected `.scad` files
		addTemplateFromAsset(eleventyConfig, SCAD_COLLECTION_LAYOUT);
		// Content template with listing
		addScadCollectionVirtualTemplate(eleventyConfig, { theme });
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
			return {
				title: filename,
				slug: filename.replace(DOT_SCAD, ""),
				scadFile: inputPath,
				stlFile: filename.replace(DOT_SCAD, DOT_STL),
				layout: layout,
				theme: theme,
				tags: [SCAD_EXT],
			} satisfies ScadTemplateData;
		},
		// #endregion
		// #region compile
		/**
		 * Compile `.scad` files into `.stl`
		 */
		async compile(inputContent: string, inputPath: string) {
			return async (data: FullPageData) => {
				debug.extend("compile")("begin %O", { inputPath, data });
				try {
					if (noSTL) {
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
					const hashesDiffer = await cache.fileHashesDiffer(inFile);

					debug.extend("compile")("pre-generate %O", {
						inFile,
						outFile,
						projectRoot,
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
