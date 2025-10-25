// @ts-expect-error I know there is no `.d.ts`
import Eleventy from "@11ty/eleventy";
import { EleventyPluginOpenSCAD } from "../../src";
import { ELEVENTY_TEST_INPUT, ELEVENTY_TEST_OUTPUT } from "./paths";
import type { EleventyConfig, MaybePluginOptions } from "../../src";

export function createEleventyScadClient(options: MaybePluginOptions) {
	return new Eleventy(ELEVENTY_TEST_INPUT, ELEVENTY_TEST_OUTPUT, {
		config: (eleventyConfig: EleventyConfig) => {
			eleventyConfig.setQuietMode(true);
			eleventyConfig.addPlugin(EleventyPluginOpenSCAD, options);
		},
	});
}
