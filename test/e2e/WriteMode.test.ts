import path from "node:path";
import { beforeAll, describe, expect, it, test } from "vitest";
import {
	cleanOutputDir,
	createTestInstance,
	TEST_SITE_OUTPUT,
	TEST_SITE_ROOT,
} from "../_setup/eleventy";
import type Eleventy from "@11ty/eleventy";

const TEST_CASES = [
	[
		"input/sphere.scad", //
		`output/sphere/index.html`,
		`output/sphere/sphere.stl`,
	],
	[
		"input/cubes/cube1.scad", //
		`output/cubes/cube1/index.html`,
		`output/cubes/cube1/cube1.stl`,
	],
	[
		"input/cubes/cube2.scad", //
		`output/cubes/cube2/index.html`,
		`output/cubes/cube2/cube2.stl`,
	],
	[
		"input/nested/grouped/cylinder.scad",
		"output/nested/grouped/cylinder/index.html",
		"output/nested/grouped/cylinder/cylinder.stl",
	],
] as [inputSCAD: string, outputHTML: string, outputSTL: string][];

let eleventy: Eleventy;

describe("eleventy.write()", () => {
	beforeAll(async () => {
		eleventy = createTestInstance({
			launchPath: "docker",
			resolveLaunchPath: false,
			silent: true,
		});
		await cleanOutputDir();
		await eleventy.write();
	});

	it(`creates /index.html`, () => {
		const collectionPage = path.join(TEST_SITE_OUTPUT, "index.html");
		expect(collectionPage).toExist();
	});

	describe.for(TEST_CASES)("%s", ([_, html, stl]) => {
		it(`creates ${stl}`, () => {
			const stlFile = path.join(TEST_SITE_ROOT, stl);
			expect(stlFile).toExist();
		});

		it(`creates ${html}`, () => {
			const indexFile = path.join(TEST_SITE_ROOT, html);
			expect(indexFile).toExist();
		});
	});
});
