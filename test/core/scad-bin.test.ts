import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { autoBinPath, SCAD_BINS } from "../../src/core/scad-bin";

const PLATFORMS: [NodeJS.Platform][] = [["linux"], ["darwin"], ["win32"]];

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

describe.for(PLATFORMS)(`on %s platforms`, ([testPlatform]) => {
	beforeEach(() => {
		vi.spyOn(process, "platform", "get").mockReturnValue(testPlatform);
	});

	describe.for(CASES[testPlatform])(
		`autoBinPath("%s")`,
		([binType, binPath]) => {
			it("returns a path", () => {
				expect(autoBinPath(binType)).toBe(binPath);
			});
		},
	);

	afterEach(() => {
		vi.restoreAllMocks();
	});
});
