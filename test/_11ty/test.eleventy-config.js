// @ts-check
import { addOpenSCADPlugin } from "../../dist/index.js";

/**
 * Testing Config
 *
 * @param {import("@11ty/eleventy/UserConfig").default} eleventyConfig
 */
export default function (eleventyConfig) {
    eleventyConfig.setInputDirectory("input");
    eleventyConfig.setOutputDirectory("output");
    eleventyConfig.setWatchJavaScriptDependencies("../../dist/**/*");
    eleventyConfig.setQuietMode(false);

    addOpenSCADPlugin(eleventyConfig, {
        launchPath: "docker",
        noSTL: true,
        // verbose: true,
    });
}
