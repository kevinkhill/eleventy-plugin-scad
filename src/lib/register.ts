import EleventyPluginOpenSCAD from "../plugin";
import type { EleventyConfig, MaybePluginOptions } from "../types";

export function addOpenSCADPlugin(
	eleventyConfig: EleventyConfig,
	options: MaybePluginOptions,
) {
	eleventyConfig.addPlugin(EleventyPluginOpenSCAD, options);
}

// https://www.11ty.dev/docs/create-plugin/#advanced-execute-a-plugin-immediately
// { immediate: true }
