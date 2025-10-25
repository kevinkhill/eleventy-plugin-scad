import { readFileSync } from "node:fs";
import path from "node:path";
import { findUpSync } from "find-up";
import { debug as $debug } from "./debug";

const debug = $debug.extend("assets");

let assetPath: string = "";

export function getAssetPath() {
	if (assetPath === "") {
		throw new Error(`"assetPath" is not set, was "ensureAssetPath()" called?`);
	}
	return assetPath;
}

export function ensureAssetPath() {
	debug(`ensuring asset path is set`);
	if (assetPath) {
		debug(`assetPath = "%s"`, assetPath);
	} else {
		debug(`searching "%s"`, import.meta.dirname);
		const found = findUpSync("assets", {
			cwd: import.meta.dirname,
			type: "directory",
		});

		if (!found) throw new Error(`"assets/" was not found!`);

		debug(`found "%s"`, found);
		assetPath = found;
	}
}

/**
 * Load an asset file from the bundle
 */
export function getAssetFileContent(file: string): string {
	const resPath = path.join(getAssetPath(), file);
	const content = readFileSync(resPath, "utf8");
	debug(`read from disk "%s"`, file);
	return content;
}
