import type { EleventyConfig } from "../types";

export function registerGlobalData(eleventyConfig: EleventyConfig) {
	eleventyConfig.addGlobalData("", () => {
		return;
	});
}
