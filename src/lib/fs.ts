import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import Debug from "./debug";

const debug = Debug.extend("fs");

export function fileExist(file: string) {
	const state = existsSync(file);
	debug("file: %o", file);
	debug("exists: %o", state);
	return state;
}

export async function ensureDirectoryExists(dir: string) {
	await mkdir(dir, { recursive: true });
}
