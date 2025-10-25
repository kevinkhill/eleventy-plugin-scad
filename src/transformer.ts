import { join } from "node:path";
import type { EleventyConfig } from "11ty.ts";
import { getLogger } from "./logger";

const SCAD_EXT = "scad";

/**
 * Rendering STLs as a transformer
 */
export default function (eleventyConfig: EleventyConfig, launchPath: string) {
  const log = getLogger(eleventyConfig, "transform");
  eleventyConfig.addTransform("scad-to-stl", async function (content) {
    const outputDirName = eleventyConfig.dir.output;
    if ((this.page.inputPath || "").endsWith(`.${SCAD_EXT}`)) {
      log("Transforming");
      // console.dir(this.page);
      const stlFilename = `${this.page.fileSlug}.stl`;
      const outFile = join(outputDirName, this.page.filePathStem, stlFilename);
      log(`Output: ${outFile}`);
      // await scad2stl(launchPath, this.page.inputPath, outFile);
    }

    // If not an HTML output, return content as-is
    return content;
  });
}
