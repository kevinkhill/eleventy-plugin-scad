import { readFileSync } from "node:fs";
import path from "node:path";
import { findUpSync } from "find-up";
import { debug } from "./debug";

let assetPath: string = "";

export function getAssetPath() {
	return assetPath;
}

export function ensureAssetPath() {
	if (assetPath) {
		debug(`assetPath = "%s"`, assetPath);
	} else {
		debug(`searching "%s" for "assets/"`, import.meta.dirname);
		const found = findUpSync("assets", {
			cwd: import.meta.dirname,
			type: "directory",
		});

		if (!found) throw new Error(`"assets/" was not found!`);

		debug(`found at "%s"`, found);
		assetPath = found;
	}
}

export function getAssetFile(file: string) {
	const resPath = path.join(assetPath, file);
	debug(`loading asset "%s`, resPath);
	return readFileSync(resPath, "utf8");
}
