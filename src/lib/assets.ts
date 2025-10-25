import { readFileSync } from "node:fs";
import path from "node:path";
import { findUpSync } from "find-up";

export function getAssetPath() {
	return findUpSync("assets", {
		cwd: import.meta.dirname,
		type: "directory",
	});
}

export function getAssetFile(file: string) {
	const dir = getAssetPath();
	if (!dir) throw new Error(`${dir} was not found!`);
	return readFileSync(path.join(dir, file), "utf8");
}
