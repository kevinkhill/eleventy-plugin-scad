import debug from "../lib/debug";
import type { PlatformMap } from "../types";

/**
 * Default OpenSCAD install locations
 *
 * @TODO: Need to verify this since I have nightly installed
 */
export const SCAD_BIN: PlatformMap = {
	linux: "openscad",
	darwin: "/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD",
	win32: "C:/Program Files/Openscad/openscad.exe",
};

/**
 * Default OpenSCAD Nightly install locations
 */
export const SCAD_BIN_NIGHTLY: PlatformMap = {
	linux: "openscad-nightly",
	darwin: "/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD", //?
	win32: "C:/Program Files/Openscad/openscad-nightly.exe",
};

/**
 * Alias mappings to use when installing the plugin into an eleventy project.
 *
 * @example ```
 * import Eleventy from "@11ty/eleventy";
 * import { EleventyPluginOpenSCAD, SCAD_BINS } from "eleventy-plugin-scad";
 *
 * const launchPath = SCAD_BINS.MACOS;
 *```
 */
export const SCAD_BINS = {
	LINUX: SCAD_BIN.linux,
	LINUX_NIGHTLY: SCAD_BIN_NIGHTLY.linux,
	MACOS: SCAD_BIN.darwin,
	MACOS_NIGHTLY: SCAD_BIN_NIGHTLY.darwin,
	WINDOWS: SCAD_BIN.win32,
	WINDOWS_NIGHTLY: SCAD_BIN_NIGHTLY.win32,
} as const;

/**
 * Returns the OpenSCAD binary path for the current platform.
 */
export function autoBinPath(
	platform: NodeJS.Platform,
	binType: null | "auto" | "nightly" = "auto",
) {
	const log = debug.extend("bin");
	const binMap = binType === "nightly" ? SCAD_BIN_NIGHTLY : SCAD_BIN;
	const bin = binMap[platform as keyof PlatformMap];
	const retVal = typeof bin === "string" ? bin : null;
	log("platform: %s", platform);
	log("binType: %s", binType);
	log("output: %s", retVal);
	return retVal;
}
