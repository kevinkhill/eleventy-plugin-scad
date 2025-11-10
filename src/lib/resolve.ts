import { existsSync } from "node:fs";
import which from "which";
import type { PathLike } from "node:fs";

/**
 * Try to resolve a launch path or binary name.
 *
 * Returns the absolute path if found or null.
 */
export function resolveOpenSCAD(launchPath?: PathLike | null) {
	const pathStr = String(launchPath);
	if (existsSync(pathStr)) return pathStr;
	return which.sync(pathStr, { nothrow: true });
}

/**
 * Assert that the given launch path is valid.
 */
export function assertValidLaunchPath(
	input?: PathLike | null,
): asserts input is string {
	if (!input) {
		throw new Error(`launchPath cannot be null or undefined.`);
	}
	const resolved = resolveOpenSCAD(input);
	if (!resolved) {
		throw new Error(
			`The launchPath "${input}" does not exist and could not be found on PATH.`,
		);
	}
}
