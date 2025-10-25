import { homedir } from "node:os";
import { join } from "node:path";
import { addOpenSCADPlugin, SCAD_BIN } from "../../dist/index.js";

/** @param {import("@11ty/eleventy/UserConfig").default} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.setInputDirectory("input");
  eleventyConfig.setOutputDirectory("output");
  eleventyConfig.addWatchTarget("../../dist/index.js");

  addOpenSCADPlugin(eleventyConfig, {
    launchPath: join(homedir(), SCAD_BIN.MACOS),
    theme: "Steely",
    verbose: true,
    collectionPage: true,
  });
}
