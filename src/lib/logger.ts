import { yellow } from "yoctocolors";
import type { EleventyConfig } from "11ty.ts";

export function getLogger(eleventyConfig: EleventyConfig) {
	return (text: string | string[]) =>
		eleventyConfig.logger.logWithOptions({
			prefix: `[11ty/${yellow("scad")}]`,
			type: "log",
			message: Array.isArray(text) ? text.join(" ") : text,
		});
}
