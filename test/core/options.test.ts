import { describe, expect, it } from "vitest";
import { PluginOptionsSchema } from "../../src/core/options";
import type { PluginOptions } from "../../src";

const DEFAULT_PLUGIN_OPTIONS: PluginOptions = {
	theme: "Traditional",
	checkLaunchPath: true,
	collectionPage: true,
	verbose: true,
	noSTL: false,
	silent: false,
};

describe("PluginOptionsSchema", () => {
	it("has sane defaults with no options set", () => {
		const parsed = PluginOptionsSchema.parse({});
		expect(parsed).toMatchObject(DEFAULT_PLUGIN_OPTIONS);
	});
});
