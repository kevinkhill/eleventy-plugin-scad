import { describe, expect, it, test } from "vitest";
import { SCAD_BIN } from "../src";
import { createEleventyScadClient } from "./_setup/11ty-scad";

describe("Eleventy OpenSCAD Plugin", () => {
	it("throws an error with bad launch path", async () => {
		expect(() => {
			const escad = createEleventyScadClient({
				launchPath: SCAD_BIN.MACOS,
				silent: true,
			});
			expect(escad.getVersion()).toBe("3.1.5");
		}).toThrowError();
	});

	it("works as expected", async () => {
		expect(() => {
			const escad = createEleventyScadClient({
				launchPath: SCAD_BIN.LINUX_NIGHTLY,
				silent: true,
			});
			expect(escad.getVersion()).toBe("3.1.5");
		}).not.toThrowError();
	});

	it("works as expected", async () => {
		expect(() => {
			const escad = createEleventyScadClient({
				launchPath: SCAD_BIN.LINUX_NIGHTLY,
				silent: true,
			});
			expect(escad.getVersion()).toBe("3.1.5");
		}).not.toThrowError();
	});
});
