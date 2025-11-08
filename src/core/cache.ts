import { readFile } from "node:fs/promises";
import { md5 } from "../lib";
import Debug from "../lib/debug";

const debug = Debug.extend("cache");
const cache = new Map<string, string>();

export function getFileHash(key: string) {
	return cache.get(key);
}

export function isFileRegistered(file: string) {
	const status = cache.has(file);
	debug({ file, registered: status });
	return status;
}

export function fileNeedsRegistration(file: string) {
	return isFileRegistered(file) === false;
}

export async function fileHashesMatch(key: string) {
	const cachedHash = getFileHash(key);
	const scadContent = await readFile(key, "utf8");
	const newHash = md5(scadContent);
	const hashMatch = newHash === cachedHash;
	// debug("comparing hashes: %O", { cached: cachedHash, current: newHash });
	debug("fileHashesMatch: %o", hashMatch);
	return hashMatch;
}

export async function fileHashesDiffer(key: string) {
	return (await fileHashesMatch(key)) !== true;
}

export async function updateHash(key: string) {
	const scadContent = await readFile(key, "utf8");
	const hash = md5(scadContent);
	cache.set(key, hash);
	debug("hashed %o", key);
}

export async function registerFile(key: string) {
	updateHash(key);
	debug({ registered: key });
}

export async function ensureFileRegistered(file: string) {
	if (fileNeedsRegistration(file)) {
		await registerFile(file);
	}
}
