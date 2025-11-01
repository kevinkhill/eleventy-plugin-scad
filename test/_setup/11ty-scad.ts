import Eleventy from "@11ty/eleventy";
import { EleventyPluginOpenSCAD } from "../../src";
import { ELEVENTY_TEST_INPUT, ELEVENTY_TEST_OUTPUT } from "./paths";
import type { EleventyConfig, MaybePluginOptions } from "../../src";

export function createEleventyTestClient(
	config: (eleventyConfig: EleventyConfig) => void,
): Eleventy {
	return new Eleventy(ELEVENTY_TEST_INPUT, ELEVENTY_TEST_OUTPUT, { config });
}

export function createEleventyScadClient(
	options: MaybePluginOptions,
): Eleventy {
	return createEleventyTestClient((eleventyConfig: EleventyConfig) => {
		eleventyConfig.setQuietMode(true);
		eleventyConfig.addPlugin(EleventyPluginOpenSCAD, options);
	});
}
