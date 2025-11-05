import { describe, expect, it } from "vitest";
import { autoBinPath } from "../../src/core/scad-bin";

const CASES = {
	linux: [
		["auto", "openscad"],
		["nightly", "openscad-nightly"],
	],
	darwin: [
		["auto", "/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD"],
		["nightly", "/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD"],
	],
	win32: [
		["auto", "C:/Program Files/Openscad/openscad.exe"],
		["nightly", "C:/Program Files/Openscad/openscad-nightly.exe"],
	],
} as Record<NodeJS.Platform, [undefined | "auto" | "nightly", string][]>;

// Derive the platform strings
const PLATFORMS = (Object.keys(CASES) as NodeJS.Platform[]).map((k) => [k]);

// run the tests
describe.for(PLATFORMS)(`on %s platforms`, ([testPlatform]) => {
	describe.for(CASES[testPlatform])(
		`autoBinPath("%s")`,
		([binType, binPath]) => {
			it("returns a path", async () => {
				expect(autoBinPath(testPlatform, binType)).toBe(binPath);
			});
		},
	);
});
