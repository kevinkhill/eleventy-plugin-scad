import { addOpenSCADPlugin } from "../../dist/index.js";

const SCAD_BIN =
  "/Users/kevinhill/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD";

/** @param {import("@11ty/eleventy/UserConfig").default} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.setInputDirectory("input");
  eleventyConfig.setOutputDirectory("output");
  eleventyConfig.addWatchTarget("../../dist/index.js");

  addOpenSCADPlugin(eleventyConfig, {
    launchPath: SCAD_BIN,
    noListing: true,
    verbose: true,
  });
}
