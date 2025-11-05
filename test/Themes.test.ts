import { describe, expect, it } from "vitest";
import { SCAD_EXT, THEMES } from "../src/core";
import { createTestInstance, DISABLE_OPENSCAD } from "./_setup/eleventy";

const cases = THEMES.map((t) => [t]);

describe.for(cases)("%s", ([theme]) => {
	const themeURL = `https://www.w3.org/StyleSheets/Core/${theme}`;

	const eleventy = createTestInstance({
		launchPath: "nightly",
		theme,
		silent: true,
		...DISABLE_OPENSCAD,
	});

	it("has the CSS URL in page", async () => {
		const pages = await eleventy.toJSON();
		const scadPages = pages.filter((p) => p.inputPath.endsWith(SCAD_EXT));

		expect(scadPages).toHaveLength(3);
		for (const page of scadPages) {
			expect(page.content.includes(themeURL)).toBeTruthy();
		}
	});
});
