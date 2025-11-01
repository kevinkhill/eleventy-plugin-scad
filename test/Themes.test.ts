import { homedir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SCAD_BIN } from "../src";
import { createEleventyScadClient } from "./_setup/11ty-scad";
import type { EleventyPageJSON } from "./_setup/types";

const THEMES = [
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
	const escad = createEleventyScadClient({
		launchPath: join(homedir(), SCAD_BIN.MACOS),
		// biome-ignore lint/suspicious/noExplicitAny: its fine
		theme: theme as any,
		silent: true,
	});

	it("has the correct theme css", async () => {
		const pages = (await escad.toJSON()) as EleventyPageJSON[];
		for (const page of pages) {
			expect(page.content).includes(theme);
		}
	});
});
