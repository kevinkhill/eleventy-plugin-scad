import { addOpenSCADPlugin, SCAD_BIN } from "../../dist/index.js";

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
    launchPath: SCAD_BIN.LINUX_NIGHTLY,
    verbose: true,
    collectionPage: true,
  });
}
