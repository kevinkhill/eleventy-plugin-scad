import { homedir } from "node:os";
import { join } from "node:path";
// @ts-expect-error I know there is no `.d.ts`
import Eleventy from "@11ty/eleventy";
import { beforeAll, describe, expect, it } from "vitest";
import { addOpenSCADPlugin, SCAD_BIN } from "../src";
import { ELEVENTY_TEST_INPUT, ELEVENTY_TEST_OUTPUT } from "./_setup/paths";
import type { EleventyConfig } from "../src";

const EleventySCAD = new Eleventy(ELEVENTY_TEST_INPUT, ELEVENTY_TEST_OUTPUT, {
	config: (eleventyConfig: EleventyConfig) => {
		addOpenSCADPlugin(eleventyConfig, {
			launchPath: join(homedir(), SCAD_BIN.MACOS),
		});
	},
});

describe("WRITE Mode", () => {
	beforeAll(async () => {
		// await rimraf(path.join(ELEVENTY_TEST_OUTPUT, "*"), { glob: true });
		await EleventySCAD.write();
	});

	describe("cube.scad", () => {
		const generatedDir = join(ELEVENTY_TEST_OUTPUT, "cube");

		it(`generated "cube/index.html"`, () => {
			const index = join(generatedDir, "index.html");
			expect(index).toExist();
		});

		it(`generated "cube/cube.stl"`, () => {
			const stl = join(generatedDir, "cube.stl");
			expect(stl).toExist();
		});
	});
});
