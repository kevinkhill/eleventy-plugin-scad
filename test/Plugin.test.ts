import { describe, expect, it, test } from "vitest";
import { createTestInstance } from "./_setup/11ty-scad";

describe("Eleventy OpenSCAD Plugin", () => {
	test.only("bad launchPath throws an Error", async () => {
		await expect(async () => {
			const eleventy = createTestInstance({
				launchPath: "THROW_ERROR.exe",
			});
			await eleventy.toJSON();
		}).rejects.toThrowError();
	});

	test('launchPath = "auto"', async () => {
		await expect(async () => {
			const eleventy = createTestInstance({
				launchPath: "auto",
			});
			await eleventy.toJSON();
		}).not.toThrowError();
	});

	test('launchPath = "nightly"', async () => {
		await expect(async () => {
			const eleventy = createTestInstance({
				launchPath: "nightly",
			});
			await eleventy.toJSON();
		}).not.toThrowError();
	});
});
