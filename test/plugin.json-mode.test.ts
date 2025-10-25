// @ts-expect-error I know there is no `.d.ts`
import Eleventy from "@11ty/eleventy";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { addOpenSCADPlugin } from "../src";
import { ELEVENTY_TEST_INPUT, ELEVENTY_TEST_OUTPUT } from "./_setup/paths";
import type { EleventyConfig } from "../src";
import type { EleventyPageJSON } from "./_setup/types";

const OpenSCAD =
	"/Users/kevinhill/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD";

const EleventySCAD = new Eleventy(ELEVENTY_TEST_INPUT, ELEVENTY_TEST_OUTPUT, {
	config: (eleventyConfig: EleventyConfig) => {
		addOpenSCADPlugin(eleventyConfig, { launchPath: OpenSCAD });
	},
});

describe("JSON Mode", () => {
	const pages: EleventyPageJSON[] = [];

	beforeAll(async () => {
		const generated = (await EleventySCAD.toJSON()) as EleventyPageJSON[];
		pages.push(...generated);
	});

	it("Generates HTML from '.scad' template", () => {
		expect(pages).toHaveLength(1);
	});

	describe("cube.scad", () => {
		let page: EleventyPageJSON;

		beforeEach(() => {
			page = pages[0];
		});

		it("has the correct URL", () => {
			expect(page.url).toBe("/cube/");
		});

		it("has valid HTML content", () => {
			expect(page.content).toMatchStartOfString("<!DOCTYPE html>");
		});

		it("has the correct input path", () => {
			expect(page.inputPath).toMatchEndOfString("input/cube.scad");
		});

		it("has the correct output path", () => {
			expect(page.outputPath).toMatchEndOfString("output/cube/index.html");
		});

		it("has the correct raw input", () => {
			expect(page.rawInput).toBe("cube(10);\n");
		});
	});
});
