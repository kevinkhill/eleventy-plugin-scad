import { EleventyPluginOpenSCAD } from "../plugin";
import type { EleventyConfig, PluginOptionsInput } from "../types";

export function addOpenSCADPlugin(
	eleventyConfig: EleventyConfig,
	options: PluginOptionsInput,
) {
	eleventyConfig.addPlugin(EleventyPluginOpenSCAD, options);
}

// https://www.11ty.dev/docs/create-plugin/#advanced-execute-a-plugin-immediately
// { immediate: true }
