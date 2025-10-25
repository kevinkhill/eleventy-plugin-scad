import { yellow } from "yoctocolors";
import type { EleventyConfig } from "11ty.ts";

export function getLogger(eleventyConfig: EleventyConfig) {
  return (message: string) =>
    eleventyConfig.logger.logWithOptions({
      prefix: `[11ty/${yellow("scad")}]`,
      type: "log",
      message,
    });
}
