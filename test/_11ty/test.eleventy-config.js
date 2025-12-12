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
    // eleventyConfig.setServerOptions({ watch: ["../../dist/assets/**"] });

    addOpenSCADPlugin(eleventyConfig, {
        collectionPageTitle: "Dev Collection",
        thumbnailColorScheme: "BeforeDawn",
        launchPath: "docker",
        noSTL: true,
        // verbose: true,
    });
}
