import { basename } from "node:path";
import { blue, bold, gray, green, red } from "yoctocolors";
import { version } from "../package.json" with { type: "json" };
import {
	createOptionParser,
	registerShortcodes,
	registerTemplates,
	scad2stl,
} from "./core";
import {
	DEFAULT_SCAD_LAYOUT,
	DOT_SCAD,
	DOT_STL,
	getLogger,
	SCAD_EXT,
} from "./lib";
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
		noSTL ? red("(STLs disabled)") : "",
	]);

	registerTemplates(eleventyConfig, noListing);
	registerShortcodes(eleventyConfig);

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

			return scadData;
		},
		/**
		 * Compile `.scad` files into `.stl`
		 */
		async compile(inputContent: string, inputPath: string) {
			return async (data: FullPageData) => {
				const stopTimer = startTimer();
				if (!noSTL) {
					log("Generating STL");
					scad2stl(launchPath, {
						in: data.scadFile,
						out: data.stlFile,
					}).then(({ errLines }) => {
						const { duration } = stopTimer();
						const action = noSTL ? blue("Would write") : "Writing";
						log(`${action} ${data.stlFile} ${gray(`from ${inputPath}`)}`);
						log(
							green(
								`Wrote ${bold(basename(data.stlFile))} in ${bold(duration)} seconds`,
							),
						);
						errLines.forEach(log);
					});
				}

				return inputContent;
			};
		},
	});
}
