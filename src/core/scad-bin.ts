import { homedir, platform } from "node:os";
import { join } from "node:path";
import { resolveOpenSCAD } from "../lib/resolve";

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
 * Helper: Returns the OpenSCAD binary path for the current platform.
 */
export function autoBinPath(): string;
export function autoBinPath(opts: {
	nightly?: boolean;
	noThrow?: false;
}): string;
export function autoBinPath(opts: {
	nightly?: boolean;
	noThrow?: true;
}): string | null;
export function autoBinPath(opts?: { nightly?: boolean; noThrow?: boolean }) {
	const p = platform();
	const map = opts?.nightly ? SCAD_BIN_NIGHTLY : SCAD_BIN;
	const bin = map[p as keyof PlatformMap];
	if (!bin) {
		if (opts?.noThrow) {
			return null;
		} else {
			throw new Error(`Unsupported platform: ${p}`);
		}
	}
	return resolveOpenSCAD(bin);
}

/**
 * Helper function to return the path to OpenSCAD if you installed it
 * in your user folder `/Users/YOU/Applications/OpenSCAD.app`
 */
export function macosUserInstalledOpenSCAD() {
	if (platform() !== "darwin") {
		throw new Error("This helper funciton only works on MacOS systems.");
	}
	return join(homedir(), ...SCAD_BIN.darwin.split("/"));
}

type PlatformMap = {
	darwin: string;
	linux: string;
	win32: string;
};
