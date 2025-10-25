// @ts-expect-error I know there is no `.d.ts`
import Eleventy from "@11ty/eleventy";
import { ELEVENTY_TEST_INPUT, ELEVENTY_TEST_OUTPUT } from "./paths";
import type { EleventyConfig } from "11ty.ts";

export function CreateEleventyInstance(
	config: (eleventyConfig: EleventyConfig) => void,
) {
	return new Eleventy(ELEVENTY_TEST_INPUT, ELEVENTY_TEST_OUTPUT, { config });
}
