import { join } from "node:path";
import { DOT_SCAD, DOT_STL, getLogger } from "../lib";
import scad2stl from "./scad2stl";
import type { EleventyConfig, PageContext } from "../types";

/**
 * Rendering STLs as a transformer
 */
export default function (eleventyConfig: EleventyConfig, launchPath: string) {
	const log = getLogger(eleventyConfig);

	eleventyConfig.addTransform(
		"scad-to-stl",
		async function transformer(this: PageContext, content: string) {
			const outputDirName = eleventyConfig.dir.output;
			if ((this.page.inputPath || "").endsWith(DOT_SCAD)) {
				log("Transforming");
				// console.dir(this.page);
				const stlFilename = `${this.page.fileSlug}${DOT_STL}`;
				const outFile = join(
					outputDirName,
					this.page.filePathStem,
					stlFilename,
				);

				await scad2stl(launchPath, {
					in: this.page.inputPath,
					out: outFile,
				});

				log(`Wrote to ${outFile}`);
			}

			// If not an HTML output, return content as-is
			return content;
		},
	);
}
