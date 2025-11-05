import { describe, expect, it } from "vitest";
import { SCAD_BINS } from "../../src/core/scad-bin";

const CASES = {
	linux: [
		["auto", SCAD_BINS.LINUX],
		["nightly", SCAD_BINS.LINUX_NIGHTLY],
	],
	darwin: [
		["auto", SCAD_BINS.MACOS],
		["nightly", SCAD_BINS.MACOS_NIGHTLY],
	],
	win32: [
		["auto", SCAD_BINS.WINDOWS],
		["nightly", SCAD_BINS.WINDOWS_NIGHTLY],
	],
} as Record<NodeJS.Platform, [undefined | "auto" | "nightly", string][]>;

const PLATFORMS = (Object.keys(CASES) as NodeJS.Platform[]).map((k) => [k]);

describe.for(PLATFORMS)(`on %s platforms`, ([testPlatform]) => {
	describe.for(CASES[testPlatform])(
		`autoBinPath("%s")`,
		([binType, binPath]) => {
			it("returns a path", async () => {
				const { autoBinPath } = await import("../../src/core/scad-bin");
				expect(autoBinPath(testPlatform, binType)).toBe(binPath);
			});
		},
	);
});
