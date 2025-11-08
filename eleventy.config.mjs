import { addOpenSCADPlugin } from "./dist/index.js";

/**
 * Testing & Development Config
 *
 *  @param {import("@11ty/eleventy/UserConfig").default} eleventyConfig
 */
export default function (eleventyConfig) {
  eleventyConfig.setInputDirectory("test/_11ty/input");
  eleventyConfig.setOutputDirectory("test/_11ty/output");
  eleventyConfig.addWatchTarget("dist/**/*");
  eleventyConfig.setQuietMode(false);

  addOpenSCADPlugin(eleventyConfig, {
    launchPath: "nightly",
    verbose: true,
  });
}
