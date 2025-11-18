import { readFileSync } from "node:fs";
import path from "node:path";
import { findUpSync } from "find-up";
import Debug from "./debug";

const debug = Debug.extend("assets");
let assetPath = "";

/**
 * Load an asset file from the bundle
 */
export function getAssetFileContent(file: string): string {
	const resPath = path.join(getAssetPath(), file);
	const content = readFileSync(resPath, "utf8");
	debug(`read from disk "%s"`, file);
	return content;
}

export function getAssetPath() {
	if (!assetPath) {
		debug(`searching: %o`, import.meta.dirname);

		const found = findUpSync("assets", {
			cwd: import.meta.dirname,
			type: "directory",
		});

		if (!found) {
			throw new Error(`"assets/" was not found!`);
		}

		debug(`found: %o`, found);
		assetPath = found;
	}

	return assetPath;
}
