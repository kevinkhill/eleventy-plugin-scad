import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { Debug } from "../lib";

const debug = Debug.extend("cache");
const $cache = new Map<string, string>();

export function getCache() {
	return $cache;
}

export function getFileHash(key: string) {
	return $cache.get(key);
}

export function isFileRegistered(file: string) {
	const status = $cache.has(file);
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
	debug({ key, cached: cachedHash, current: newHash });
	// debug("fileHashesMatch: %o", hashMatch);
	return hashMatch;
}

export async function updateHash(key: string) {
	const scadContent = await readFile(key, "utf8");
	const hash = md5(scadContent);
	$cache.set(key, hash);
	// debug("hashed %o", key);
}

export async function registerFile(key: string) {
	updateHash(key);
	debug("registered: %o", key);
}

export async function ensureFileRegistered(file: string) {
	if (fileNeedsRegistration(file)) {
		await registerFile(file);
	}
}

function md5(input: string) {
	return createHash("md5").update(input).digest("hex");
}
