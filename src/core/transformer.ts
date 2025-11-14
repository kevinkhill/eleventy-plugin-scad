import { join } from "node:path";
import { getLogger } from "../lib/logger";
import { DOT_SCAD, DOT_STL } from "./const";
import { scad2stl } from "./generator";
import type { EleventyConfig, EleventyScope } from "../types";

/**
 * Rendering STLs as a transformer
 */
export function registerTransformer(
	eleventyConfig: EleventyConfig,
	launchPath: string,
) {
	const logger = getLogger(eleventyConfig);

	eleventyConfig.addTransform(
		"scad-to-stl",
		async function transformer(this: EleventyScope, content: string) {
			const outputDirName = eleventyConfig.dir.output;
			if ((this.page.inputPath || "").endsWith(DOT_SCAD)) {
				logger.log("Transforming");
				// console.dir(this.page);
				const stlFilename = `${this.page.fileSlug}${DOT_STL}`;
				const outFile = join(
					outputDirName,
					this.page.filePathStem,
					stlFilename,
				);

				await scad2stl(launchPath, {
					cwd: "",
					in: this.page.inputPath,
					out: outFile,
				});

				logger.log(`Wrote to ${outFile}`);
			}

			// If not an HTML output, return content as-is
			return content;
		},
	);
}
