import { EleventyPluginOpenSCAD } from "../plugin";
import type { EleventyConfig, PluginOptionsInput } from "../types";

/**
 * Helper function to add plugin with type hints
 *
 * @link https://www.11ty.dev/docs/create-plugin/#advanced-execute-a-plugin-immediately
 */
export function addOpenSCADPlugin(
	eleventyConfig: EleventyConfig,
	options: PluginOptionsInput,
) {
	eleventyConfig.addPlugin(EleventyPluginOpenSCAD, options);
}

/**
 * Helper function to add and execute plugin with type hints
 *
 * @link https://www.11ty.dev/docs/create-plugin/#advanced-execute-a-plugin-immediately
 */
export function addOpenSCADPluginImmediately(
	eleventyConfig: EleventyConfig,
	options: PluginOptionsInput,
) {
	eleventyConfig.addPlugin(EleventyPluginOpenSCAD, {
		...options,
		immediate: true,
	});
}
