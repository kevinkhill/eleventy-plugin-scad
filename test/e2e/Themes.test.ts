import { expect, test } from "vitest";
import { SCAD_EXT, THEMES } from "../../src/core";
import { createTestInstance } from "../_setup/eleventy";

const CASES = THEMES.map((t) => [t]);

test("invalid theme throws an error", async () => {
	await expect(async () => {
		// @ts-expect-error
		const eleventy = createTestInstance({ theme: "TacoBell#324" });
		await eleventy.toJSON();
	}).rejects.toThrow("Error processing the `EleventyPluginOpenSCAD` plugin");
});

test.each(CASES)("%s", async (theme) => {
	const eleventy = createTestInstance({
		launchPath: "docker",
		resolveLaunchPath: false,
		theme: theme,
		silent: true,
		noSTL: true,
	});
	const pages = await eleventy.toJSON();
	const scadPages = pages.filter((p) => p.inputPath.endsWith(SCAD_EXT));

	for (const page of scadPages) {
		const themeURL = `https://www.w3.org/StyleSheets/Core/${theme}`;
		expect(page.content).includes(themeURL);
	}
});
