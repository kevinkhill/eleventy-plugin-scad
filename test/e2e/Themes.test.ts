import path from "node:path";
import { describe, expect, it, test } from "vitest";
import { createTestInstance } from "../_setup/eleventy";
import type { EleventyDirs, ModelViewerTheme } from "../../src";

const CASES: ModelViewerTheme[][] = [
	["Traditional"],
	["Modernist"],
	["Midnight"],
	["Chocolate"],
	["Oldstyle"],
	["Steely"],
	["Swiss"],
	["Ultramarine"],
];

describe.for(CASES)("Theme: %s", async ([theme]) => {
	const eleventy = createTestInstance({
		launchPath: "docker",
		resolveLaunchPath: false,
		theme: theme,
		silent: true,
		noSTL: true,
	});

	const pages = await eleventy.toJSON();

	for (const page of pages) {
		const relativeSTL = path.relative(
			(eleventy.directories as EleventyDirs).output,
			page.outputPath,
		);
		test(`CSS: ${relativeSTL}`, () => {
			const themeURL = `https://www.w3.org/StyleSheets/Core/${theme}`;
			expect(page.content).includes(themeURL);
		});
	}
});

test("invalid theme throws an error", async () => {
	await expect(async () => {
		// @ts-expect-error
		const eleventy = createTestInstance({ theme: "TacoBell#324" });
		await eleventy.toJSON();
	}).rejects.toThrow("Error processing the `EleventyPluginOpenSCAD` plugin");
});
