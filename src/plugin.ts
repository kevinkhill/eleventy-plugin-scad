import path from "node:path";
import { blue, bold, gray, green, red } from "yoctocolors";
import { prettifyError } from "zod";
import { name } from "../package.json" with { type: "json" };
import {
	addBuiltinScadLayoutVirtualTemplate,
	addScadCollectionVirtualTemplate,
	addScadGlobalData,
	addShortcodes,
	cache,
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
	ensureDirectoryExists,
	fileExist,
	resolveOpenSCAD,
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

	const resolvedScadBin = resolveOpenSCAD(launchPath);
	if (checkLaunchPath && resolvedScadBin === null) {
		const message = `The launchPath "${launchPath}" does not exist.`;
		log(red(message));
		throw new Error(message);
	}

	// Type Asserting function to make this variable exclude `null`
	assertValidLaunchPath(resolvedScadBin);

	if (!silent) {
		logPluginReady(parsedOptions.data);
	}
	// #endregion

	// #region Plugin Body
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
	 * Highlight markdown blocks with "```scad"
	 */
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
				theme: theme,
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
				const inFile = data.scadFile;
				const outFile = path.join(writeDir, data.stlFile);

				// Writing of the template actually creates the dir so trying to write
				// the STL first to the same location before the template was failing
				await ensureDirectoryExists(writeDir);

				const action = noSTL ? blue("Would write") : "Writing";
				log(`${action} ${data.stlFile} ${gray(`from ${inputPath}`)}`);

				// Hash the contents of the file in memory for caching
				await cache.ensureFileRegistered(inFile);
				log(`Registered ${path.basename(inFile)}`);

				const stlExist = fileExist(outFile);

				if (await cache.fileHashesDiffer(inFile)) {
					console.log(`NEEDS REGEN, does STL exist?`, stlExist);
				} else {
					console.log(`NO CHANGES`);
				}

				/**
				 * Begin STL Compilation
				 */
				const scadResult = await scad2stl(resolvedScadBin, {
					in: inFile,
					out: outFile,
				});
				debug("result: %O", scadResult);

				if (!scadResult.ok) {
					log(red("OpenSCAD encountered an issue"));
					for (const line of scadResult.output) {
						const cleanLine = line.replaceAll("\n", "");
						log(red(cleanLine));
					}
					return inputContent;
				}

				// log what OpenSCAD output during rendering
				if (verbose) {
					const lines = scadResult.output.flatMap((l) => l.split("\n"));
					for (const line of lines) {
						log(gray(`\t${line}`));
					}
				}

				const duration = scadResult.duration.toFixed(2);
				log(green(`Wrote ${bold(data.stlFile)} in ${bold(duration)} seconds`));

				return inputContent;
			};
		},
	});
	// #endregion

	// #region logPluginReady
	/**
	 * Helper to de-clutter the top of the plugin
	 */
	function logPluginReady({
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
