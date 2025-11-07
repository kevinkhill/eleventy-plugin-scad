import { readFile } from "node:fs/promises";
import Debug from "../lib/debug";
import { md5 } from "../lib/hash";

const debug = Debug.extend("cache");
const cache = new Map<string, string>();

export function getFileHash(key: string) {
	return cache.get(key);
}

export function isFileRegistered(file: string) {
	const status = cache.has(file);
	debug("file: %o", file);
	debug("registered: %o", status);
	return status;
}

export function fileNeedsRegistration(file: string) {
	return isFileRegistered(file) === false;
}

export async function fileHashesMatch(key: string) {
	const currHash = getFileHash(key);
	const scadContent = await readFile(key, "utf8");
	const newHash = md5(scadContent);
	return newHash === currHash;
}

export async function fileHashesDiffer(key: string) {
	return (await fileHashesMatch(key)) !== true;
}

export async function registerFile(key: string) {
	const scadContent = await readFile(key, "utf8");
	const hash = md5(scadContent);
	cache.set(key, hash);
	isFileRegistered(key);
}

export async function ensureFileRegistered(file: string) {
	if (fileNeedsRegistration(file)) {
		await registerFile(file);
	}
}
