// @ts-expect-error I know there is no `.d.ts`
import Eleventy from "@11ty/eleventy";
import type { EleventyConfig } from "11ty.ts";

export function CreateEleventyInstance(args: {
	input: string;
	output: string;
	config: (eleventyConfig: EleventyConfig) => void;
}) {
	return new Eleventy(args.input, args.output, { config: args.config });
}
