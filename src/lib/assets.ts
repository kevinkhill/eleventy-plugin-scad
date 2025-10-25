import { readFileSync } from "node:fs";
import path from "node:path";
import { findUpSync } from "find-up";

export function getAssetPath(dirName: "_includes" | "_layouts") {
	return findUpSync(dirName, {
		cwd: import.meta.dirname,
		type: "directory",
	});
}

export function getAssetFile(dirName: "_includes" | "_layouts", file: string) {
	const dir = getAssetPath(dirName);
	if (!dir) throw new Error(`${dir} was not found!`);
	return readFileSync(path.join(dir, file), "utf8");
}
