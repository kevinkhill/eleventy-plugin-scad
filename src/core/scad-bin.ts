import { homedir, platform } from "node:os";
import { join } from "node:path";

export const SCAD_BIN = {
	LINUX: "openscad",
	LINUX_NIGHTLY: "openscad-nightly",
	MACOS: "/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD",

	// I need to verify these
	WINDOWS: "C:/Program Files/Openscad/openscad.exe",
	WINDOWS_NIGHTLY: "C:/Program Files/Openscad/openscad-nightly.exe",
} as const;

export const PLATFORM_MAP_SCAD_BIN: Partial<Record<NodeJS.Platform, string>> = {
	linux: SCAD_BIN.LINUX,
	darwin: SCAD_BIN.MACOS,
	win32: SCAD_BIN.WINDOWS,
};

/**
 * Helper function that attempts to get the bin path based on `os.platform()`
 */
export function discoverBinPath(): string {
	const p = platform();
	const bin = PLATFORM_MAP_SCAD_BIN[p];
	if (!bin) throw new Error(`Unsupported platform: ${p}`);
	return bin;
}

/**
 * Helper function to return the path to OpenSCAD if you installed
 * it in your user folder `~/Applications/`
 */
export function macosUserInstalledOpenSCAD() {
	return join(homedir(), SCAD_BIN.MACOS);
}
