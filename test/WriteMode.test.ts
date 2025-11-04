import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { createTestInstance, TEST_SITE_OUTPUT } from "./_setup/11ty-scad";

const escad = createTestInstance({
	launchPath: "nightly",
});

describe("WRITE Mode", () => {
	beforeAll(async () => {
		// await rimraf(path.join(ELEVENTY_TEST_OUTPUT, "*"), { glob: true });
		await escad.write();
	});

	describe("cube.scad", () => {
		const generatedDir = path.join(TEST_SITE_OUTPUT, "cube");

		it(`generated "cube/index.html"`, () => {
			const index = path.join(generatedDir, "index.html");
			expect(index).toExist();
		});

		it(`generated "cube/cube.stl"`, () => {
			const stl = path.join(generatedDir, "cube.stl");
			expect(stl).toExist();
		});
	});
});
