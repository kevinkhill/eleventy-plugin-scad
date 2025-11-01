import { platform } from "node:os";
import { describe, expect, test } from "vitest";
import { discoverBinPath, SCAD_BIN } from "../../src/core";

describe("discoverBinPath()", () => {
	test.runIf(platform() === "linux")("returns a path on linux", () => {
		expect(discoverBinPath()).toBe(SCAD_BIN.LINUX);
	});

	test.runIf(platform() === "darwin")("returns a path on macos", () => {
		expect(discoverBinPath()).toBe(SCAD_BIN.MACOS);
	});

	test.runIf(platform() === "win32")("returns a path on windows", () => {
		expect(discoverBinPath()).toBe(SCAD_BIN.WINDOWS);
	});
});
