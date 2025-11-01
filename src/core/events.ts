import { getLogger } from "../lib";
import type { EleventyConfig } from "../lib/types";

export function registerEventHandlers(eleventyConfig: EleventyConfig) {
	const logger = getLogger(eleventyConfig);

	// biome-ignore lint/suspicious/noExplicitAny: merp
	eleventyConfig.on("eleventy.before", (_event: any) => {
		logger.logWithOptions({
			message: "eleventy.before",
			color: "magenta",
			prefix: "🪵\n\t",
			force: true,
		});
	});

	// biome-ignore lint/suspicious/noExplicitAny: merp
	eleventyConfig.on("eleventy.after", (_event: any) => {
		logger.logWithOptions({
			message: "eleventy.after",
			color: "magenta",
			prefix: "🪵\n\t",
			force: true,
		});

		// eleventyConfig.addTemplate;
	});
}
