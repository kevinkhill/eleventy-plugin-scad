import { beforeAll, describe, expect, it } from "vitest";
import { EleventySCAD } from "./EleventySCAD";

describe.skip("11ty-plugin-openscad - WRITE", () => {
	beforeAll(async () => await EleventySCAD.write());

	it("Generates HTML for a `.scad` file", () => {
		expect(1).toBe(1);
	});
});
