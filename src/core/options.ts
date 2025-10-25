import { existsSync } from "node:fs";
import { env } from "node:process";
import z from "zod";

/**
 * Eleventy OpenSCAD Plugin Options
 *
 * - **launchPath**: Location of the OpenSCAD executable (required)
 * - **layout**: Use a custom layout for the scad files
 * - **collectionPage**: Set `true` to generate a listing page from `collections.scad`
 * - **verbose**: Set `true` to view the compilation output from OpenSCAD
 * - **noSTL**: Set `true` to skip generating STLs
 * - **silent**: Set `true` to disable all logging from the plugin
 */
export default z.object({
	launchPath: z.string().refine((val) => {
		if (!existsSync(val)) return `Does Not Exist: ${val}`;
		return true;
	}),
	layout: z.string().optional().nullish(),
	collectionPage: z
		.boolean()
		.optional()
		.default(parseBooleanEnv(env.ELEVENTY_SCAD_COLLECTION_PAGE, true)),
	verbose: z
		.boolean()
		.optional()
		.default(parseBooleanEnv(env.ELEVENTY_SCAD_VERBOSE, false)),
	silent: z
		.boolean()
		.optional()
		.default(parseBooleanEnv(env.ELEVENTY_SCAD_VERBOSE, false)),
	noSTL: z
		.boolean()
		.optional()
		.default(parseBooleanEnv(env.ELEVENTY_SCAD_NO_STL, false)),
});

/**
 * Helper function to get default values if set via envvars
 */
function parseBooleanEnv(val: unknown, defaultVal: boolean): boolean {
	if (typeof val === "boolean") return val;
	if (typeof val === "string") {
		const v = val.trim().toLowerCase();
		if (["true", "1"].includes(v)) return true;
		if (["false", "0"].includes(v)) return false;
	}
	return defaultVal;
}
