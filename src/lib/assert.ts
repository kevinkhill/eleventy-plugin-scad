import { resolveOpenSCAD } from "./resolve";
import type { PathLike } from "node:fs";

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
