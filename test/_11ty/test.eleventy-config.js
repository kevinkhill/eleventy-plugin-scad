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
        theme: "Swiss",
        thumbnailColorScheme: "ClearSky",
        collectionPageTitle: "Dev Collection",
        // noSTL: true,
        // verbose: false,
    });
}
