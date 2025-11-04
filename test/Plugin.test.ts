import { describe, expect, it, test } from "vitest";
import { createTestInstance } from "./_setup/11ty-scad";

describe("Eleventy OpenSCAD Plugin", () => {
	it("throws an error with bad launch path", async () => {
		expect(() => {
			const escad = createTestInstance({
				launchPath: "TACO_BELL",
			});
			expect(escad.getVersion()).toBe("3.1.2");
		}).toThrowError();
	});

	test('launchPath = "auto"', async () => {
		expect(() => {
			const escad = createTestInstance({
				launchPath: "auto",
			});
			expect(escad.getVersion()).toBe("3.1.2");
		}).not.toThrowError();
	});

	test('launchPath = "nightly"', async () => {
		expect(() => {
			const escad = createTestInstance({
				launchPath: "",
			});
			expect(escad.getVersion()).toBe("3.1.2");
		}).not.toThrowError();
	});
});
