import path from "node:path";
import { blue, bold, cyan, gray, green, red, reset } from "yoctocolors";
import { prettifyError } from "zod";
import {
	addBuiltinScadLayoutVirtualTemplate,
	addScadCollectionVirtualTemplate,
	addScadGlobalData,
	addShortcodes,
	cache,
	parseOptions,
	scad2stl,
} from "./core";
import {
	DEFAULT_PLUGIN_THEME,
	DEFAULT_SCAD_LAYOUT,
	DOT_SCAD,
	DOT_STL,
	PLUGIN_NAME,
	SCAD_EXT,
} from "./core/const";
import { ensureAssetPath } from "./lib/assets";
import Debug from "./lib/debug";
import { ensureDirectoryExists, fileExist } from "./lib/fs";
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
export default function EleventyPluginOpenSCAD(
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
		log(red("Options Error"));
		log(message);
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
	addScadGlobalData(eleventyConfig);
	addShortcodes(eleventyConfig);
	// registerEventHandlers(eleventyConfig);

	// Default renderer for `.scad` files once turned into HTML
	addBuiltinScadLayoutVirtualTemplate(eleventyConfig);

	// Add template file that lists all the collected `.scad` files
	if (collectionPage) {
		addScadCollectionVirtualTemplate(eleventyConfig);
	}

	// Copy all `.scad` files over with the renders
	// if (copySCAD) {
	// 	eleventyConfig.addPassthroughCopy(`**/*${DOT_SCAD}`);
	// }

	// Highlight markdown blocks with "```scad"
	// addScadMarkdownHighlighter(eleventyConfig);

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
		getData(inputPath: string): ScadTemplateData {
			const filename = path.basename(inputPath);
			return {
				title: filename,
				layout: layout ?? DEFAULT_SCAD_LAYOUT,
				theme: theme ?? DEFAULT_PLUGIN_THEME,
				tags: ["scad"],
				scadFile: inputPath,
				stlFile: filename.replace(DOT_SCAD, DOT_STL),
				slug: filename.replace(DOT_SCAD, ""),
			};
		},
		// #endregion
		// #region compile
		/**
		 * Compile `.scad` files into `.stl`
		 */
		async compile(inputContent: string, inputPath: string) {
			if (noSTL) return () => inputContent;
			return async (data: FullPageData) => {
				// biome-ignore lint/suspicious/noExplicitAny: its fine
				const dirs = (data.eleventy as any).directories as EleventyDirs;
				const writeDir = path.join(dirs.output, data.page.fileSlug);

				// Writing of the template actually creates the dir so trying to write
				// the STL first to the same location before the template was failing
				await ensureDirectoryExists(writeDir);

				/** `.scad` source */
				const inFile = data.scadFile;

				/** `.stl` target */
				const outFile = path.join(writeDir, data.stlFile);

				// does this do anything for me? maybe?... keep it?
				this.addDependencies(inputPath, [outFile]);

				// md5 the contents of the file for caching
				await cache.ensureFileRegistered(inFile);

				const stlExists = fileExist(outFile);
				const hashesDiffer = await cache.fileHashesDiffer(inFile);

				debug({ inFile, outFile, stlExists, hashesDiffer });

				if (!stlExists || hashesDiffer) {
					_log(
						`${noSTL ? blue("Would write") : reset("Writing")} ${data.stlFile} ${gray(`from ${inputPath}`)}`,
					);

					const scadResult = await scad2stl(String(resolvedScadBin), {
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

				return inputContent;
			};
		},
	});
	// #endregion
}
