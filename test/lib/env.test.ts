import { afterEach, beforeEach, describe, expect, it, test } from "vitest";
import { getOptionsFromEnv } from "../../src/lib/env";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
	process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
	process.env = ORIGINAL_ENV;
});

describe("getOptionsFromEnv()", () => {
	it("has undefined options when none are set", () => {
		const data = getOptionsFromEnv(process.env);

		expect(data.theme).toBeUndefined();
		expect(data.noSTL).toBeUndefined();
		expect(data.silent).toBeUndefined();
		expect(data.layout).toBeUndefined();
		expect(data.verbose).toBeUndefined();
		expect(data.launchPath).toBeUndefined();
		expect(data.collectionPage).toBeUndefined();
		expect(data.resolveLaunchPath).toBeUndefined();
	});

	test(`ELEVENTY_SCAD_LAUNCH_PATH sets launchPath`, () => {
		const bin = "openscad-nightly";

		process.env.ELEVENTY_SCAD_LAUNCH_PATH = bin;

		const data = getOptionsFromEnv(process.env);

		expect(data.launchPath).toBe(bin);
	});

	test(`ELEVENTY_SCAD_THEME sets theme`, () => {
		const value = "dark";

		process.env.ELEVENTY_SCAD_THEME = value;

		const data = getOptionsFromEnv(process.env);

		expect(data.theme).toBe(value);
	});

	test(`ELEVENTY_SCAD_THUMBNAIL_COLOR_SCHEME sets thumbnailColorScheme`, () => {
		const value = "Monotone";

		process.env.ELEVENTY_SCAD_THUMBNAIL_COLOR_SCHEME = value;

		const data = getOptionsFromEnv(process.env);

		expect(data.thumbnailColorScheme).toBe(value);
	});

	test(`ELEVENTY_SCAD_LAYOUT sets layout`, () => {
		const value = "my-layout.njk";

		process.env.ELEVENTY_SCAD_LAYOUT = value;

		const data = getOptionsFromEnv(process.env);

		expect(data.layout).toBe(value);
	});

	test(`ELEVENTY_SCAD_NO_STL sets noSTL`, () => {
		process.env.ELEVENTY_SCAD_NO_STL = "true";

		const data = getOptionsFromEnv(process.env);

		expect(data.noSTL).toBeTruthy();
	});

	test(`ELEVENTY_SCAD_SILENT sets silent`, () => {
		process.env.ELEVENTY_SCAD_SILENT = "1";

		const data = getOptionsFromEnv(process.env);

		expect(data.silent).toBeTruthy();
	});

	test(`ELEVENTY_SCAD_VERBOSE sets verbose`, () => {
		process.env.ELEVENTY_SCAD_VERBOSE = "1";

		const data = getOptionsFromEnv(process.env);

		expect(data.verbose).toBeTruthy();
	});

	test(`ELEVENTY_SCAD_COLLECTION_PAGE sets collectionPage`, () => {
		process.env.ELEVENTY_SCAD_COLLECTION_PAGE = "false";

		const data = getOptionsFromEnv(process.env);

		expect(data.collectionPage).toBeFalsy();
	});

	test(`ELEVENTY_SCAD_RESOLVE_LAUNCH_PATH sets resolveLaunchPath`, () => {
		process.env.ELEVENTY_SCAD_RESOLVE_LAUNCH_PATH = "0";

		const data = getOptionsFromEnv(process.env);

		expect(data.resolveLaunchPath).toBeFalsy();
	});
});
