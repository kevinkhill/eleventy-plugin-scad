// @ts-expect-error I know there is no `.d.ts`
import Eleventy from "@11ty/eleventy";
import { OpenSCAD } from "../src";
import { ELEVENTY_TEST_INPUT, ELEVENTY_TEST_OUTPUT } from "./_setup/paths";

export const EleventySCAD = new Eleventy(
	ELEVENTY_TEST_INPUT,
	ELEVENTY_TEST_OUTPUT,
	{
		config: (eleventyConfig) => {
			eleventyConfig.addPlugin(OpenSCAD, {
				launchPath:
					"/Users/kevinhill/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD",
			});
		},
	},
);
