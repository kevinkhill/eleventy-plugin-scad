import { mkdir } from "node:fs/promises";
import path from "node:path";
import { blue, bold, gray, green, red } from "yoctocolors";
import { prettifyError } from "zod";
import { name } from "../package.json" with { type: "json" };
import {
	addBuiltinScadLayoutVirtualTemplate,
	addScadCollectionVirtualTemplate,
	addShortcodes,
	DEFAULT_SCAD_LAYOUT,
	DOT_SCAD,
	DOT_STL,
	PluginOptionsSchema,
	SCAD_EXT,
	scad2stl,
} from "./core";
import { addScadGlobalData } from "./core/global-data";
import { createScadLogger, debug, ensureAssetPath, startTimer } from "./lib";
import type {
	EleventyConfig,
	EleventyDirs,
	FullPageData,
	MaybePluginOptions,
	PluginOptions,
	ScadTemplateData,
} from "./types";

/**
 * Eleventy Plugin for OpenSCAD
 *
 * @param {EleventyConfig} eleventyConfig
 * @param {MaybePluginOptions} options
 */
export default function (
	eleventyConfig: EleventyConfig,
	options: MaybePluginOptions,
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

	const parsedOptions = PluginOptionsSchema.safeParse(options);
	debug.extend("zod")("parsed options = %O", parsedOptions);

	if (parsedOptions.error) {
		log(red("Options Error"));
		log(prettifyError(parsedOptions.error));
		return;
	}

	const { launchPath, layout, collectionPage, noSTL, verbose, silent, theme } =
		parsedOptions.data;

	if (!silent) {
		logPluginReadyMessage(parsedOptions.data);
	}

	/**
	 * Global data for templates
	 */
	addScadGlobalData(eleventyConfig);

	/**
	 * Highlight markdown blocks with "```scad"
	 */
	// addScadMarkdownHighlighter(eleventyConfig);

	/**
	 * Handy shortcodes for building up STL renderers
	 */
	addShortcodes(eleventyConfig, { theme });

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
	// eleventyConfig.addPassthroughCopy(`**/*${DOT_SCAD}`);

	/**
	 * Register `.scad` files as virtual template files and
	 * define they are to be compiled into html & stl files.
	 */
	eleventyConfig.addTemplateFormats(SCAD_EXT);
	eleventyConfig.addExtension(SCAD_EXT, {
		/**
		 * Data provided to the layout & page of a `.scad` file template
		 */
		getData(inputPath: string) {
			const filename = path.basename(inputPath);
			return {
				layout: layout ?? DEFAULT_SCAD_LAYOUT,
				tags: ["scad"],
				slug: filename.replace(DOT_SCAD, ""),
				title: filename,
				scadFile: inputPath,
				stlFile: filename.replace(DOT_SCAD, DOT_STL),
			} satisfies ScadTemplateData;
		},
		/**
		 * Compile `.scad` files into `.stl`
		 */
		async compile(inputContent: string, inputPath: string) {
			if (noSTL) return () => inputContent;

			return async (data: FullPageData) => {
				//@ts-expect-error This does exist but my `.d.ts` is not working right
				const dirs = data.eleventy?.directories as EleventyDirs;
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
				const { output, ok } = await scad2stl(launchPath, {
					in: data.scadFile,
					out: path.join(writeDir, data.stlFile),
				});
				const { duration } = stopTimer();

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

	/**
	 * Helper to de-clutter the top of the plugin
	 */
	function logPluginReadyMessage({
		silent,
		theme,
		verbose,
		noSTL,
		collectionPage,
	}: PluginOptions) {
		log(`${gray("Theme:")} ${theme}`);
		log(
			[
				gray(" Opts:"),
				silent ? green("+silent") : "",
				verbose ? green("+verbose") : "",
				noSTL ? red("-noSTL") : "",
				!collectionPage ? red("-collectionPage") : "",
			]
				.join(" ")
				.replaceAll(/\s+/g, " "),
		);
	}
}
