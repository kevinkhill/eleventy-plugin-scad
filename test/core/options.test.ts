import { afterEach, beforeEach, describe, expect, it, test } from "vitest";
import { DEFAULT_PLUGIN_THEME } from "../../src/config";
import { DEFAULT_SCAD_LAYOUT } from "../../src/core";
import { parseOptions } from "../../src/core/options";
import type { ModelViewerTheme } from "../../src/types";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
	// Clone the env each time so tests do not leak
	process.env = { ...ORIGINAL_ENV };
});

describe("parseOptions()", () => {
	it("returns sane defaults when no options or env vars are set", () => {
		const { success, data } = parseOptions({});

		expect(success).toBeTruthy();
		expect(data?.launchPath).toBe("docker:dev");
		expect(data?.layout).toBe(DEFAULT_SCAD_LAYOUT);
		expect(data?.theme).toBe(DEFAULT_PLUGIN_THEME);
		expect(data?.resolveLaunchPath).toBe(true);
		expect(data?.collectionPage).toBe(true);
		expect(data?.verbose).toBe(true);
		expect(data?.noSTL).toBe(false);
		expect(data?.silent).toBe(false);
	});

	test(`ELEVENTY_SCAD_LAUNCH_PATH sets launchPath`, () => {
		const nightly = "openscad-nightly";
		process.env.ELEVENTY_SCAD_LAUNCH_PATH = nightly;

		const { success, data } = parseOptions({}, process.env);

		expect(success).toBeTruthy();
		expect(data?.launchPath).toBe(nightly);
	});

	test(`ELEVENTY_SCAD_LAYOUT sets layout`, () => {
		const layout = "custom-layout";
		process.env.ELEVENTY_SCAD_LAYOUT = layout;

		const { success, data } = parseOptions({}, process.env);

		expect(success).toBeTruthy();
		expect(data?.layout).toBe(layout);
	});

	test(`ELEVENTY_SCAD_THEME sets theme`, () => {
		const theme: ModelViewerTheme = "Swiss";
		process.env.ELEVENTY_SCAD_THEME = theme;

		const { success, data } = parseOptions({}, process.env);

		expect(success).toBeTruthy();
		expect(data?.theme).toBe(theme);
	});

	test(`ELEVENTY_SCAD_RESOLVE_LAUNCH_PATH sets resolveLaunchPath`, () => {
		process.env.ELEVENTY_SCAD_RESOLVE_LAUNCH_PATH = "false";

		const { success, data } = parseOptions({}, process.env);

		expect(success).toBeTruthy();
		expect(data?.resolveLaunchPath).toBe(false);
	});

	test(`ELEVENTY_SCAD_COLLECTION_PAGE sets collectionPage`, () => {
		process.env.ELEVENTY_SCAD_COLLECTION_PAGE = "false";

		const { success, data } = parseOptions({}, process.env);

		expect(success).toBeTruthy();
		expect(data?.collectionPage).toBe(false);
	});

	test(`ELEVENTY_SCAD_VERBOSE sets verbose`, () => {
		process.env.ELEVENTY_SCAD_VERBOSE = "false";

		const { success, data } = parseOptions({}, process.env);

		expect(success).toBeTruthy();
		expect(data?.verbose).toBe(false);
	});

	test(`ELEVENTY_SCAD_NO_STL sets noSTL`, () => {
		process.env.ELEVENTY_SCAD_NO_STL = "true";

		const { success, data } = parseOptions({}, process.env);

		expect(success).toBeTruthy();
		expect(data?.noSTL).toBeTruthy();
	});

	test(`ELEVENTY_SCAD_SILENT sets silent`, () => {
		process.env.ELEVENTY_SCAD_SILENT = "true";

		const { success, data } = parseOptions({}, process.env);

		expect(success).toBeTruthy();
		expect(data?.silent).toBe(true);
	});
});

afterEach(() => {
	// Restore original env
	process.env = ORIGINAL_ENV;
});
