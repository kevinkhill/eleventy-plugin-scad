import { homedir } from "node:os";
import path from "node:path";
// @ts-expect-error I know there is no `.d.ts`
import Eleventy from "@11ty/eleventy";
import { beforeAll, describe, expect, it } from "vitest";
import { addOpenSCADPlugin } from "../src";
import { ELEVENTY_TEST_INPUT, ELEVENTY_TEST_OUTPUT } from "./_setup/paths";
import type { EleventyConfig } from "../src";

const OpenSCAD = path.join(
	homedir(),
	"Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD",
);
const EleventySCAD = new Eleventy(ELEVENTY_TEST_INPUT, ELEVENTY_TEST_OUTPUT, {
	config: (eleventyConfig: EleventyConfig) => {
		addOpenSCADPlugin(eleventyConfig, { launchPath: OpenSCAD });
	},
});

describe("WRITE Mode", () => {
	beforeAll(async () => {
		// await rimraf(path.join(ELEVENTY_TEST_OUTPUT, "*"), { glob: true });
		await EleventySCAD.write();
	});

	describe("cube.scad", () => {
		it(`generated "cube/index.html"`, () => {
			const index = path.join(ELEVENTY_TEST_OUTPUT, "cube", "index.html");
			expect(index).toExist();
		});

		it(`generated "cube/cube.stl"`, () => {
			const stl = path.join(ELEVENTY_TEST_OUTPUT, "cube", "cube.stl");
			expect(stl).toExist();
		});
	});
});
