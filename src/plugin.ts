import { mkdir } from "node:fs/promises";
import path from "node:path";
import { blue, bold, gray, green, red } from "yoctocolors";
import { prettifyError } from "zod";
import { name } from "../package.json" with { type: "json" };
import {
	addBuiltinScadLayoutVirtualTemplate,
	addScadCollectionVirtualTemplate,
	addScadGlobalData,
	addShortcodes,
	DEFAULT_SCAD_LAYOUT,
	DOT_SCAD,
	DOT_STL,
	PluginOptionsSchema,
	SCAD_EXT,
	scad2stl,
} from "./core";
import {
	assertValidLaunchPath,
	createScadLogger,
	debug,
	ensureAssetPath,
	resolveOpenSCAD,
	startTimer,
} from "./lib";
import type {
	EleventyConfig,
	EleventyDirs,
	FullPageData,
	PluginOptions,
	PluginOptionsInput,
	ScadTemplateData,
} from "./types";

// #region Begin Plugin
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
			`[${name}] WARN Eleventy plugin compatibility: ${(e as Error).message}`,
		);
	}

	ensureAssetPath();
	// registerEventHandlers(eleventyConfig);

	const log = createScadLogger(eleventyConfig);

	// #region Parse Options
	const parsedOptions = PluginOptionsSchema.safeParse(options);
	debug.extend("zod")("parsed options = %O", parsedOptions);

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
		checkLaunchPath,
	} = parsedOptions.data;

	/**
	 * This is hacky, but I want an escape hatch for testing
	 */
	const resolvedScadBin = resolveOpenSCAD(launchPath);
	console.error(resolvedScadBin);
	if (checkLaunchPath && resolvedScadBin === null) {
		const message = `The launchPath "${launchPath}" does not exist.`;
		log(red(message));
		throw new Error(message);
	}

	assertValidLaunchPath(resolvedScadBin);

	if (!silent) {
		logPluginReadyMessage(parsedOptions.data);
	}
	// #endregion

	// #region Plugin Body
	/**
	 * Highlight markdown blocks with "```scad"
	 */
	// addScadMarkdownHighlighter(eleventyConfig);

	/**
	 * Global data for templates
	 */
	addScadGlobalData(eleventyConfig);

	/**
	 * Handy shortcodes for building STL renderers
	 */
	addShortcodes(eleventyConfig, { defaultTheme: theme });

	/**
	 * Default renderer for `.scad` files once turned into HTML
	 */
	addBuiltinScadLayoutVirtualTemplate(eleventyConfig);

	/**
	 * Add template file that lists all the collected `.scad` files
	 */
	if (collectionPage) {
		addScadCollectionVirtualTemplate(eleventyConfig);
	}

	/**
	 * Copy all `.scad` files over with the renders
	 */
	// if (copySCAD) {
	// 	eleventyConfig.addPassthroughCopy(`**/*${DOT_SCAD}`);
	// }

	/**
	 * Register `.scad` files as virtual template files and
	 * define they are to be compiled into html & stl files.
	 */
	// #region Compilation
	eleventyConfig.addTemplateFormats(SCAD_EXT);
	eleventyConfig.addExtension(SCAD_EXT, {
		/**
		 * Data provided to the layout & page of a `.scad` file template
		 */
		getData(inputPath: string): ScadTemplateData {
			const filename = path.basename(inputPath);
			return {
				title: filename,
				layout: layout ?? DEFAULT_SCAD_LAYOUT,
				theme: theme,
				tags: ["scad"],
				scadFile: inputPath,
				stlFile: filename.replace(DOT_SCAD, DOT_STL),
				slug: filename.replace(DOT_SCAD, ""),
			};
		},
		/**
		 * Compile `.scad` files into `.stl`
		 */
		async compile(inputContent: string, inputPath: string) {
			if (noSTL) return () => inputContent;

			return async (data: FullPageData) => {
				// biome-ignore lint/suspicious/noExplicitAny: its fine
				const dirs = (data.eleventy as any).directories as EleventyDirs;
				const writeDir = path.join(dirs.output, data.page.fileSlug);

				// This was added because writing of the template actually creates the dir
				// so trying to write the STL to the same location before the template was failing
				await mkdir(writeDir, { recursive: true });

				const action = noSTL ? blue("Would write") : "Writing";
				log(`${action} ${data.stlFile} ${gray(`from ${inputPath}`)}`);

				/**
				 * Begin STL Compilation
				 */
				const stopTimer = startTimer();
				const { output, ok } = await scad2stl(resolvedScadBin, {
					in: data.scadFile,
					out: path.join(writeDir, data.stlFile),
				});
				const duration = stopTimer();

				if (!ok) {
					log(red("OpenSCAD encountered an issue"));
					for (const line of output) {
						const cleanLine = line.replaceAll("\n", "");
						log(red(cleanLine));
					}
					return inputContent;
				}

				if (verbose) {
					const lines = output.flatMap((line) => line.split("\n"));
					for (const line of lines) {
						log(gray(`\t${line}`));
					}
				}
				log(
					green(
						`Wrote ${bold(data.stlFile)} in ${bold(duration.toFixed(2))} seconds`,
					),
				);

				return inputContent;
			};
		},
	});
	// #endregion

	// #region Helpers
	/**
	 * Helper to de-clutter the top of the plugin
	 */
	function logPluginReadyMessage({
		silent,
		theme,
		verbose,
		noSTL,
		collectionPage,
		checkLaunchPath,
	}: PluginOptions) {
		log(`${gray("Theme:")} ${theme}`);
		log(
			[
				gray(" Opts:"),
				silent ? green("+silent") : "",
				verbose ? green("+verbose") : "",
				noSTL ? red("-noSTL") : "",
				!checkLaunchPath ? red("-launchPathCheck") : "",
				!collectionPage ? red("-collectionPage") : "",
			]
				.join(" ")
				.replaceAll(/\s+/g, " "),
		);
	}
	// #endregion
}
// #endregion
