// @ts-check
import { addOpenSCADPlugin } from "../../dist/index.js";

/**
 * Testing Config
 *
 * @param {import("@11ty/eleventy/UserConfig").default} eleventyConfig
 */
export default function (eleventyConfig) {
    eleventyConfig.setQuietMode(false);
    eleventyConfig.setInputDirectory("input");
    eleventyConfig.setOutputDirectory("output");
    eleventyConfig.addWatchTarget("../../dist/**");

    addOpenSCADPlugin(eleventyConfig, {
        launchPath: "docker",
        theme: "Midnight",
        thumbnailColorScheme: "Nocturnal Gem",
        collectionPageTitle: "Dev Collection",
        noSTL: true,
        // verbose: true,
    });
}
