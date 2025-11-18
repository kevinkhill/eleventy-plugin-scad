import { stringbool } from "zod";
import Debug from "./debug";

const debug = Debug.extend("env");

export function getOptionsFromEnv(env: NodeJS.ProcessEnv) {
	function getEnv(varName: string) {
		const value = env[varName];
		if (typeof value === "undefined") return;
		debug.extend("string")("%s=%o", varName, value);
		return value;
	}

	function parseStringBool(varName: string) {
		const value = env[varName];
		if (typeof value === "undefined") return;
		const result = stringbool().optional().parse(value);
		debug.extend("boolean")("%s=%o", varName, result);
		return result;
	}

	return {
		theme: getEnv("ELEVENTY_SCAD_THEME"),
		layout: getEnv("ELEVENTY_SCAD_LAYOUT"),
		launchPath: getEnv("ELEVENTY_SCAD_LAUNCH_PATH"),
		noSTL: parseStringBool("ELEVENTY_SCAD_NO_STL"),
		silent: parseStringBool("ELEVENTY_SCAD_SILENT"),
		verbose: parseStringBool("ELEVENTY_SCAD_VERBOSE"),
		collectionPage: parseStringBool("ELEVENTY_SCAD_COLLECTION_PAGE"),
		resolveLaunchPath: parseStringBool("ELEVENTY_SCAD_RESOLVE_LAUNCH_PATH"),
	} as const;
}
