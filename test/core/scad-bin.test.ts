import { platform } from "node:os";
import { describe, expect, test } from "vitest";
import { autoBinPath, SCAD_BINS } from "../../src/core/scad-bin";

describe.skip("discoverBinPath()", () => {
	test.runIf(platform() === "linux")("returns a path on linux", () => {
		expect(autoBinPath()).toBe(SCAD_BINS.LINUX_NIGHTLY);
	});

	test.runIf(platform() === "darwin")("returns a path on macos", () => {
		expect(autoBinPath()).toBe(SCAD_BINS.MACOS);
	});

	test.runIf(platform() === "win32")("returns a path on windows", () => {
		expect(autoBinPath()).toBe(SCAD_BINS.WINDOWS);
	});
});
