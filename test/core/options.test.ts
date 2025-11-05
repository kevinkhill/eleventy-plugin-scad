import { describe, expect, it } from "vitest";
import { PluginOptionsSchema } from "../../src/core/options";

describe("PluginOptionsSchema", () => {
	it("has sane defaults with no options set", () => {
		const o = PluginOptionsSchema.parse({});

		expect(o).toMatchObject({
			checkLaunchPath: true,
			collectionPage: true,
			noSTL: false,
			silent: false,
			theme: "Midnight",
			verbose: false,
		});
	});
});
