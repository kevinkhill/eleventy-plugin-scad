import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_PLUGIN_THEME } from "../../src/config";
import { PluginOptionsSchema } from "../../src/core/options";

const ORIGINAL_ENV = process.env;

describe.skip("PluginOptionsSchema", () => {
	beforeEach(() => {
		// Clone the env each time so tests do not leak
		process.env = { ...ORIGINAL_ENV };
	});

	afterEach(() => {
		// Restore original env
		process.env = ORIGINAL_ENV;
	});

	it("provides defaults when no options or env vars are set", () => {
		const parsed = PluginOptionsSchema.parse({});

		// Because theme resolves to DEFAULT_PLUGIN_THEME
		expect(parsed.theme).toBe(DEFAULT_PLUGIN_THEME);

		expect(parsed.resolveLaunchPath).toBe(true);
		expect(parsed.collectionPage).toBe(true);
		expect(parsed.verbose).toBe(true);
		expect(parsed.noSTL).toBe(false);
		expect(parsed.silent).toBe(false);

		// launchPath and layout are optional
		expect(parsed.launchPath).toBeDefined();
		expect(parsed.layout).toBeUndefined();
	});

	it("uses ELEVENTY_SCAD_THEME when defined and valid", () => {
		process.env.ELEVENTY_SCAD_THEME = "Traditional";

		const parsed = PluginOptionsSchema.parse({});
		expect(parsed.theme).toBe("Traditional");
	});

	it("uses ELEVENTY_SCAD_VERBOSE from env", () => {
		process.env.ELEVENTY_SCAD_VERBOSE = "false";
		const parsed = PluginOptionsSchema.parse({});
		expect(parsed.verbose).toBe(false);
	});

	it("uses ELEVENTY_SCAD_COLLECTION_PAGE from env", () => {
		process.env.ELEVENTY_SCAD_COLLECTION_PAGE = "0";
		const parsed = PluginOptionsSchema.parse({});
		expect(parsed.collectionPage).toBe(false);
	});

	it("uses ELEVENTY_SCAD_SILENT from env", () => {
		process.env.ELEVENTY_SCAD_SILENT = "true";
		const parsed = PluginOptionsSchema.parse({});
		expect(parsed.silent).toBe(true);
	});

	it("uses ELEVENTY_SCAD_NO_STL from env", () => {
		process.env.ELEVENTY_SCAD_NO_STL = "1";
		const parsed = PluginOptionsSchema.parse({});
		expect(parsed.noSTL).toBe(true);
	});

	it("uses ELEVENTY_SCAD_RESOLVE_LAUNCH_PATH from env", () => {
		process.env.ELEVENTY_SCAD_RESOLVE_LAUNCH_PATH = "false";
		const parsed = PluginOptionsSchema.parse({});
		expect(parsed.resolveLaunchPath).toBe(false);
	});

	it("prefers explicit values over env vars", () => {
		process.env.ELEVENTY_SCAD_VERBOSE = "false";

		const parsed = PluginOptionsSchema.parse({
			verbose: true,
		});

		expect(parsed.verbose).toBe(true); // explicit wins
	});

	it.skip("rejects invalid theme values from env", () => {
		process.env.ELEVENTY_SCAD_THEME = "InvalidTheme";

		const result = PluginOptionsSchema.safeParse({});

		expect(result.success).toBe(false);
		expect(result.error?.issues[0].message).toContain("Invalid theme");
	});

	it("allows setting theme directly via options", () => {
		process.env.ELEVENTY_SCAD_THEME = "BeforeDawn";

		const parsed = PluginOptionsSchema.parse({
			theme: "Traditional",
		});

		// Explicit value takes precedence
		expect(parsed.theme).toBe("Traditional");
	});
});
