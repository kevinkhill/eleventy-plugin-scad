import { expect, test } from "vitest";
import { SCAD_EXT, THEMES } from "../src/core";
import { createTestInstance } from "./_setup/eleventy";
import type { PluginOptionsInput } from "../src/types";

const CASES = THEMES.map((t) => [t]);

const PLUGIN_OPTS = {
	launchPath: "nightly",
	resolveLaunchPath: false,
	silent: true,
	noSTL: true,
} satisfies PluginOptionsInput;

test.concurrent.for(CASES)("%s", async ([theme]) => {
	const themeURL = `https://www.w3.org/StyleSheets/Core/${theme}`;
	const eleventy = createTestInstance({ theme, ...PLUGIN_OPTS });

	const pages = await eleventy.toJSON();
	const scadPages = pages.filter((p) => p.inputPath.endsWith(SCAD_EXT));

	expect(scadPages).toHaveLength(3);
	for (const page of scadPages) {
		expect(page.content).includes(themeURL);
	}
});

test("invalid theme throws an error", async () => {
	await expect(async () => {
		// @ts-expect-error
		const eleventy = createTestInstance({ theme: "TacoBell#324" });
		await eleventy.toJSON();
	}).rejects.toThrow("Error processing the `EleventyPluginOpenSCAD` plugin");
});
