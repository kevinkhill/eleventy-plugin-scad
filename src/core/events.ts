import { getLogger } from "../lib";
import type { EleventyConfig } from "../types";

export function registerEventHandlers(eleventyConfig: EleventyConfig) {
	const logger = getLogger(eleventyConfig);

	eleventyConfig.on("eleventy.before", (event) => {
		logger.logWithOptions({
			message: "eleventy.before",
			color: "magenta",
			prefix: "🪵\n\t",
			force: true,
		});
	});

	eleventyConfig.on("eleventy.after", (event) => {
		logger.logWithOptions({
			message: "eleventy.after",
			color: "magenta",
			prefix: "🪵\n\t",
			force: true,
		});

		// eleventyConfig.addTemplate;
	});
}
