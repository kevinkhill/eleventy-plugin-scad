import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { PluginOptionsSchema } from "../../src/core/options";

describe("PluginOptionsSchema", () => {
	it("has sane defaults with no options set", () => {
		const o = PluginOptionsSchema.parse({});
		expect(o).toMatchObject({
			theme: "Midnight",
			checkLaunchPath: true,
			collectionPage: true,
			noSTL: false,
			silent: false,
			verbose: false,
		});
	});

	it("errors with an invalid theme", () => {
		const o = PluginOptionsSchema.safeParse({
			theme: "TacoBell#324",
		});
		expect(o.success).toBeFalsy();
		expect(o.error).toBeInstanceOf(ZodError);
	});
});
