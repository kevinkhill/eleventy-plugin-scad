import { homedir } from "node:os";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { SCAD_BIN } from "../src";
import { createEleventyScadClient } from "./_setup/11ty-scad";
import { ELEVENTY_TEST_OUTPUT } from "./_setup/paths";

const escad = createEleventyScadClient({
	launchPath: path.join(homedir(), SCAD_BIN.MACOS),
	silent: true,
});

describe("WRITE Mode", () => {
	beforeAll(async () => {
		// await rimraf(path.join(ELEVENTY_TEST_OUTPUT, "*"), { glob: true });
		await escad.write();
	});

	describe("cube.scad", () => {
		const generatedDir = path.join(ELEVENTY_TEST_OUTPUT, "cube");

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
