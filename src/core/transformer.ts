import { join } from "node:path";
import { Debug } from "../lib";
import { getLogger } from "../lib/logger";
import { DOT_SCAD, DOT_STL } from "./const";
import { scadExporter } from "./exporter";
import type { EleventyConfig, EleventyScope, Files } from "../types";

const debug = Debug.extend("transformer");

/**
 * Rendering STLs as a transformer
 */
export function addScad2PngTransformer(
	eleventyConfig: EleventyConfig,
	launchPath: string,
) {
	const logger = getLogger(eleventyConfig);
	eleventyConfig.addTransform(
		"scad2png",
		async function transformer(this: EleventyScope, content: string) {
			const { page } = this;
			debug("context: %O", eleventyConfig);
			const outputDirName = eleventyConfig.dir.output;

			logger.log("Transforming");
			// console.dir(this.page);
			const outFile = join(
				outputDirName,
				page.filePathStem,
				`${page.fileSlug}.png`,
			);
			const files: Files = {
				cwd: "",
				in: page.inputPath,
				out: outFile,
			};
			debug(files);
			await scadExporter(launchPath, files, "png");

			logger.log(`Wrote to ${outFile}`);

			// return content as-is
			return content;
		},
	);
	debug("registered scad2png transformer");
}

// eleventyConfig.addTransform(
// 	"scad-to-stl",
// 	async function transformer(this: EleventyScope, content: string) {
// 		const outputDirName = eleventyConfig.dir.output;
// 		if ((this.page.inputPath || "").endsWith(DOT_SCAD)) {
// 			logger.log("Transforming");
// 			// console.dir(this.page);
// 			const stlFilename = `${this.page.fileSlug}${DOT_STL}`;
// 			const outFile = join(
// 				outputDirName,
// 				this.page.filePathStem,
// 				stlFilename,
// 			);

// 			await scad2stl(launchPath, {
// 				cwd: "",
// 				in: this.page.inputPath,
// 				out: outFile,
// 			});

// 			logger.log(`Wrote to ${outFile}`);
// 		}

// 		// If not an HTML output, return content as-is
// 		return content;
// 	},
// );
