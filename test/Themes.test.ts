import { describe, expect, it } from "vitest";
import { SCAD_EXT } from "../src/core";
import { createTestInstance, DISABLE_OPENSCAD } from "./_setup/11ty-scad";
import type { StlViewerThemes } from "../src";

const THEMES: StlViewerThemes[][] = [
	["Chocolate"],
	["Midnight"],
	["Modernist"],
	["Oldstyle"],
	["Steely"],
	["Swiss"],
	["Traditional"],
	["Ultramarine"],
];

describe.for(THEMES)("Theme: %s", ([theme]) => {
	const escad = createTestInstance({
		launchPath: "nightly",
		theme,
		silent: true,
		...DISABLE_OPENSCAD,
	});

	it("has the correct theme css", async () => {
		const pages = await escad.toJSON();
		const scadPages = pages.filter((p) => p.inputPath.endsWith(SCAD_EXT));

		expect(scadPages).toHaveLength(3);
		for (const page of scadPages) {
			expect(page.content.includes(theme)).toBeTruthy();
		}
	});
});
