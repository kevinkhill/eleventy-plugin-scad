import { mkdir } from "node:fs/promises";
import path from "node:path";
import { blue, bold, gray, green, red } from "yoctocolors";
import { prettifyError } from "zod";
import { name, version } from "../package.json" with { type: "json" };
import {
	addBuiltinScadLayoutVirtualTemplate,
	addScadCollectionVirtualTemplate,
	addScadMarkdownHighlighter,
	addShortcodes,
	DEFAULT_SCAD_LAYOUT,
	DOT_SCAD,
	DOT_STL,
	PluginOptionsSchema,
	registerEventHandlers,
	SCAD_EXT,
	scad2stl,
} from "./core";
import { ensureAssetPath, getLogger, startTimer } from "./lib";
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
		// Emit a warning message if the application is not using Eleventy 3.0 or newer (including prereleases).
		eleventyConfig.versionCheck(">=3.0");
	} catch (e) {
		console.log(
			`[${name}] WARN Eleventy plugin compatibility: ${(e as Error).message}`,
		);
	}
	ensureAssetPath();
	const logger = getLogger(eleventyConfig);
	const parsedOptions = PluginOptionsSchema.safeParse(options);

	if (parsedOptions.error) {
		logger(red("Options Error"));
		logger(prettifyError(parsedOptions.error));
		process.exit();
	}

	const { launchPath, layout, collectionPage, noSTL, verbose, silent, theme } =
		parsedOptions.data;

	// Wrapping logger to make it able to be silenced
	const log: typeof logger = (arg) => {
		if (!silent) logger(arg);
	};

	// registerEventHandlers(eleventyConfig);
	logPluginReadyMessage(log, parsedOptions.data);

	/**
	 * Highlight markdown blocks with "```scad"
	 */
	addScadMarkdownHighlighter(eleventyConfig);

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
}

function logPluginReadyMessage(
	log: (m: string) => void,
	{ silent, theme, verbose, noSTL, collectionPage }: PluginOptions,
) {
	log(green(`Plugin v${version} Ready`));
	log(`${gray("Theme: ")} ${theme}`);
	log(
		[
			gray("Options: "),
			silent ? green("+silent") : "",
			verbose ? green("+verbose") : "",
			noSTL ? red("-noSTL") : "",
			!collectionPage ? red("-collectionPage") : "",
		]
			.join(" ")
			.replaceAll(/\s+/g, " "),
	);
}
