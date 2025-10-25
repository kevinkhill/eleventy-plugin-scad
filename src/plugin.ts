import { basename } from "node:path";
import { blue, bold, gray, green, red } from "yoctocolors";
import { version } from "../package.json" with { type: "json" };
import {
	addBuiltinScadLayoutVirtualTemplate,
	addScadCollectionVirtualTemplate,
	createOptionParser,
	registerShortcodes,
	scad2stl,
} from "./core";
import { DEFAULT_SCAD_LAYOUT, DOT_SCAD, DOT_STL, SCAD_EXT } from "./lib/const";
import { getLogger } from "./lib/logger";
import { startTimer } from "./lib/timer";
import type {
	EleventyConfig,
	FullPageData,
	MaybePluginOptions,
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
	const log = getLogger(eleventyConfig);
	const parseOptions = createOptionParser({ logger: log });
	const parsedOptions = parseOptions(options);
	const { launchPath, layout, noSTL, noListing } = parsedOptions;

	log([
		green("Plugin Ready"),
		gray(`(v${version})`),
		noSTL ? red("-noSTL") : "",
		noListing ? red("-noListing") : "",
	]);

	/**
	 * Handy shortcodes for building up STL renderers
	 */
	registerShortcodes(eleventyConfig);

	/**
	 * Default renderer for `.scad` files once turned into HTML
	 */
	addBuiltinScadLayoutVirtualTemplate(eleventyConfig);

	/**
	 * Add template file that lists all the collected `.scad` files
	 */
	if (!noListing) {
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
		getData(inputPath: string): Partial<FullPageData> {
			const inputDirName = eleventyConfig.directoryAssignments.input;
			const outputDirName = eleventyConfig.dir.output;
			log(`inputDirName=${inputDirName}`);
			log(`outputDirName=${outputDirName}`);
			// console.dir(eleventyConfig, { depth: 1 });

			const filename = basename(inputPath);
			const fileSlug = filename.replace(DOT_SCAD, "");

			const outFile = inputPath
				.replace(inputDirName, outputDirName)
				.replace(filename, `${fileSlug}/${filename}`)
				.replace(DOT_SCAD, DOT_STL);

			const outFileUrl = outFile
				.replace(/^\.\/?/, "")
				.replace(outputDirName, "");

			const scadData: ScadTemplateData = {
				layout: layout ?? DEFAULT_SCAD_LAYOUT,
				tags: ["scad"],
				title: filename,
				scadFile: inputPath,
				stlFile: outFile,
				stlUrl: outFileUrl,
			};
			log("Collected Data");
			log(JSON.stringify(scadData));

			return scadData;
		},
		/**
		 * Compile `.scad` files into `.stl`
		 */
		async compile(inputContent: string, inputPath: string) {
			if (noSTL) return () => inputContent;

			return async (data: FullPageData) => {
				console.log("PAGE DATA", data);
				const action = noSTL ? blue("Would write") : "Writing";
				log(`${action} ${data.stlFile} ${gray(`from ${inputPath}`)}`);

				const stopTimer = startTimer();
				const { output, ok } = await scad2stl(launchPath, {
					in: data.scadFile,
					out: data.stlFile,
				});
				const { duration } = stopTimer();
				if (ok) {
					for (const line of output) {
						log(line);
					}
					log(
						green(
							`Wrote ${bold(basename(data.stlFile))} in ${bold(duration.toFixed(2))} seconds`,
						),
					);
				} else {
					log(red("OpenSCAD encountered an issue"));
					for (const line of output) {
						const cleanLine = line.replaceAll("\n", "");
						log(red(cleanLine));
					}
				}
				return inputContent;
			};
		},
	});

	eleventyConfig.on("eleventy.after", ({ dir, runMode }) => {
		log("eleventy.after");
		console.log("Resolved directories:", dir);
		console.log("Output directory:", dir.output);
		console.log("runMode:", runMode);
		// Now you can use dir.output in your plugin logic
	});
}
