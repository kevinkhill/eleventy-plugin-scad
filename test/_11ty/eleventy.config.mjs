import { addOpenSCADPlugin } from "../../dist/index.js";

/**
 * Testing & Development Config
 *
 *  @param {import("@11ty/eleventy/UserConfig").default} eleventyConfig
 */
export default function (eleventyConfig) {
  eleventyConfig.setQuietMode(false);
  eleventyConfig.setInputDirectory("input");
  eleventyConfig.setOutputDirectory("output");
  eleventyConfig.addWatchTarget("../../dist/**/*");

  addOpenSCADPlugin(eleventyConfig, {
    launchPath: "nightly",
    verbose: true,
    collectionPage: true,
  });
}
