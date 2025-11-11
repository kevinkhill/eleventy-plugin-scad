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
