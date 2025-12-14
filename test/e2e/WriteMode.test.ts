import path from "node:path";
import { beforeAll, describe, expect, suite, test } from "vitest";
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
		`output/sphere/sphere.png`,
	],
	[
		"input/cubes/bridge.scad", //
		`output/cubes/bridge/index.html`,
		`output/cubes/bridge/bridge.stl`,
		`output/cubes/bridge/bridge.png`,
	],
	[
		"input/cubes/xyz_cube.scad", //
		`output/cubes/xyz_cube/index.html`,
		`output/cubes/xyz_cube/xyz_cube.stl`,
		`output/cubes/xyz_cube/xyz_cube.png`,
	],
	[
		"input/nested/grouped/cylinder.scad",
		"output/nested/grouped/cylinder/index.html",
		"output/nested/grouped/cylinder/cylinder.stl",
		"output/nested/grouped/cylinder/cylinder.png",
	],
] as [
	inputSCAD: string,
	outputHTML: string,
	outputSTL: string,
	outputPNG: string,
][];

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

	test(`index.html`, () => {
		const collectionPage = path.join(TEST_SITE_OUTPUT, "index.html");
		expect(collectionPage).toExist();
	});

	suite.for(TEST_CASES)("%s", ([_, html, stl, png]) => {
		test(stl, () => {
			const stlFile = path.join(TEST_SITE_ROOT, stl);
			expect(stlFile).toExist();
		});

		test(html, () => {
			const indexFile = path.join(TEST_SITE_ROOT, html);
			expect(indexFile).toExist();
		});

		test(png, () => {
			const thumbnail = path.join(TEST_SITE_ROOT, png);
			expect(thumbnail).toExist();
		});
	});
});
