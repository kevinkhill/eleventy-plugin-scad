import EleventyPluginOpenSCAD from "../plugin";
import type { EleventyConfig, MaybePluginOptions } from "../types";

export function addOpenSCADPlugin(
	eleventyConfig: EleventyConfig,
	options: MaybePluginOptions,
) {
	eleventyConfig.addPlugin(EleventyPluginOpenSCAD, options);
}
