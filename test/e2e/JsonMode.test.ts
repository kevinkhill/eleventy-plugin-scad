import path from "node:path";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createTestInstance } from "../_setup/eleventy";
import type Eleventy from "@11ty/eleventy";

const TEST_CASES = [
	[
		"input/sphere.scad",
		`output/sphere/index.html`,
		`output/sphere/sphere.stl`,
		"/sphere/", //
	],
	[
		"input/cubes/cube1.scad",
		`output/cubes/cube1/index.html`,
		`output/cubes/cube1/cube1.stl`,
		"/cubes/cube1/", //
	],
	[
		"input/cubes/cube2.scad",
		`output/cubes/cube2/index.html`,
		`output/cubes/cube2/cube.stl`,
		"/cubes/cube2/", //
	],
	[
		"input/nested/grouped/cylinder.scad",
		"output/nested/grouped/cylinder/index.html",
		"output/nested/grouped/cylinder/cylinder.stl",
		"/nested/grouped/cylinder/",
	],
] as [inputSCAD: string, outputHTML: string, outputSTL: string, url: string][];

let eleventy: Eleventy;
let pages: EleventyPageJSON[] = [];

describe.for(TEST_CASES)("%s", ([scad, html, stl, url]) => {
	let page: EleventyPageJSON | undefined;

	beforeAll(async () => {
		eleventy = createTestInstance({
			launchPath: "docker",
			resolveLaunchPath: false,
			noSTL: true,
			silent: true,
		});
		pages = await eleventy.toJSON();
	});

	beforeEach(() => {
		page = pages.find((p) => {
			const inputFileName = path.basename(scad);
			return p.inputPath.endsWith(inputFileName);
		});
	});

	it("has the correct URL", () => {
		expect(page?.url).toBe(url);
	});

	it("has the correct input path", () => {
		expect(page?.inputPath).toEndWithString(scad);
	});

	it("has the correct output path", () => {
		expect(page?.outputPath).toEndWithString(html);
	});

	it("has valid HTML content", () => {
		const content = page?.content?.toLowerCase();
		expect(content).toStartWithString("<!doctype html>");
		expect(content).toEndWithString("</html>\n");
	});
});

describe("(virtual) index.html", () => {
	let page: EleventyPageJSON | undefined;

	beforeAll(() => {
		page = pages.find((p) => p.url === "/");
	});

	it("has the correct URL", () => {
		expect(page?.url).toBe("/");
	});

	it("has valid HTML content", () => {
		const content = page?.content?.toLowerCase();
		expect(content).toStartWithString("<!doctype html>");
		expect(content).toEndWithString("</html>\n");
	});

	it("has the correct input path", () => {
		expect(page?.inputPath).toEndWithString(`input/index.njk`);
	});

	it("generated the correct output HTML file", () => {
		expect(page?.outputPath).toEndWithString(`output/index.html`);
	});
});

type EleventyPageJSON = Awaited<ReturnType<typeof eleventy.toJSON>>[number];
