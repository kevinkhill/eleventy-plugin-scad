import { describe, expect, it } from "vitest";
import { createTestInstance } from "./_setup/eleventy";

describe("Eleventy OpenSCAD Plugin", () => {
	it("throws an Error with a bad launchPath", async () => {
		await expect(async () => {
			const eleventy = createTestInstance({
				launchPath: "THROW_ERROR.exe",
			});
			await eleventy.toJSON();
		}).rejects.toThrowError();
	});
});
