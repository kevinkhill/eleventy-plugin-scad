import type { EleventyConfig } from "../types";

export function registerEventHandlers(eleventyConfig: EleventyConfig) {
	eleventyConfig.on("eleventy.before", (event) => {
		console.log("🪵  eleventy.before");
	});

	eleventyConfig.on("eleventy.after", (event) => {
		console.log("🪵  eleventy.after");
	});
}
