import { beforeAll, describe, expect, it } from "vitest";
import { OpenSCAD } from "../src";
import { CreateEleventyInstance } from "./_setup/generator";
import type { EleventyPageJSON } from "./_setup/types";

const Eleventy = CreateEleventyInstance((eleventyConfig) => {
	eleventyConfig.addPlugin(OpenSCAD, {
		launchPath:
			"/Users/kevinhill/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD",
	});
});

describe("OpenSCAD 11ty Plugin", () => {
	const PAGES: EleventyPageJSON[] = [];

	beforeAll(async () => {
		const pages = (await Eleventy.toJSON()) as EleventyPageJSON[];
		PAGES.push(...pages);
	});

	it("Generates HTML for a `.scad` file", () => {
		expect(1).toBe(1);
	});
});
