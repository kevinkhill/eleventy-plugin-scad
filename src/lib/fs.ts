import { existsSync, mkdirSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import Debug from "./debug";
import type { PathLike } from "node:fs";

const debug = Debug.extend("fs");

export function exists(pathToCheck: PathLike) {
	const state = existsSync(pathToCheck);
	debug({ path: pathToCheck, exists: state });
	return state;
}

export function relativePathFromCwd(cwd: string, file: string) {
	return `./${path.relative(cwd, file)}`;
}

/**
 * Given the absolute path to a file, create the directories required to save it
 */
export function mkdirForFileSync(filepath: string) {
	if (!path.isAbsolute(filepath)) {
		throw new Error("mkdirForFileSync() only works with absolute file paths");
	}
	const directory = path.dirname(filepath);
	debug("mkdirForFile: %O", directory);
	return mkdirSync(directory, { recursive: true });
}

/**
 * Given the absolute path to a file, create the directories required to save it
 */
export async function mkdirForFileAsync(filepath: string) {
	if (!path.isAbsolute(filepath)) {
		throw new Error("mkdirForFileAsync() only works with absolute file paths");
	}
	const directory = path.dirname(filepath);
	await mkdir(directory, { recursive: true });
}
