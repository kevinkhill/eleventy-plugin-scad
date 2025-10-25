import { beforeAll, describe, expect, it } from "vitest";
import { OpenSCAD } from "../src";
import { CreateEleventyInstance } from "./_setup/generator";

const Eleventy = CreateEleventyInstance((eleventyConfig) => {
	eleventyConfig.addPlugin(OpenSCAD, {
		launchPath:
			"/Users/kevinhill/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD",
	});
});

describe("OpenSCAD 11ty Plugin", () => {
	beforeAll(async () => {
		await Eleventy.write();
	});

	it("Generates HTML for a `.scad` file", () => {
		expect(1).toBe(1);
	});
});
