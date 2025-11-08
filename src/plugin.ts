import path from "node:path";
import { blue, bold, gray, green, red, reset } from "yoctocolors";
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

	// Make sure the asset paths exist
	ensureAssetPath();

	// Type assertion function to make typeof resolvedScadBin === string
	assertValidLaunchPath(resolvedScadBin);

	if (!silent) {
		logPluginReady(parsedOptions.data);
	}
	// #endregion

	// #region Plugin Body
	addScadGlobalData(eleventyConfig);
	addShortcodes(eleventyConfig, { defaultTheme: theme });
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

				// Writing of the template actually creates the dir so trying to write
				// the STL first to the same location before the template was failing
				await ensureDirectoryExists(writeDir);

				/** `.scad` source */
				const inFile = data.scadFile;

				/** `.stl` target */
				const outFile = path.join(writeDir, data.stlFile);

				// Unsure what this does for me if anything
				this.addDependencies(inputPath, [outFile]);

				// md5 the contents of the file for caching
				await cache.ensureFileRegistered(inFile);
				debug("cached: %o", path.basename(inFile));

				const stlExists = fileExist(outFile);
				const hashesDiffer = await cache.fileHashesDiffer(inFile);

				debug({ stlExists, hashesDiffer });

				if (!stlExists || hashesDiffer) {
					log(
						`${noSTL ? blue("Would write") : reset("Writing")} ${data.stlFile} ${gray(`from ${inputPath}`)}`,
					);

					const scadResult = await scad2stl(resolvedScadBin, {
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

					if (verbose) {
						// log what OpenSCAD output during rendering
						const lines = scadResult.output.flatMap((l) => l.split("\n"));
						for (const line of lines) {
							log(gray(`\t${line}`));
						}
					}

					const duration = scadResult.duration.toFixed(2);
					log(
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
