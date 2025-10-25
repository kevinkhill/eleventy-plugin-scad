import { existsSync } from "node:fs";
import { env } from "node:process";
import z from "zod";

/**
 * Eleventy OpenSCAD Plugin Options
 *
 * - **launchPath**: Location of the OpenSCAD executable
 * - **layout**: Use a custom layout for the scad files
 * - **verbose**: Set `true` to view the compilation output from OpenSCAD
 * - **noSTL**: Set `true` to skip generating STLs
 * - **noListing**: Set `true` to skip generating a listing page from `collections.scad`
 */
export default z.object({
	launchPath: z.string().refine((val) => {
		if (!existsSync(val)) return `Does Not Exist: ${val}`;
		return true;
	}),
	layout: z.string().optional().nullish(),
	verbose: z
		.boolean()
		.optional()
		.default(parseBooleanEnv(env.ELEVENTY_SCAD_VERBOSE, false)),
	noSTL: z
		.boolean()
		.optional()
		.default(parseBooleanEnv(env.ELEVENTY_SCAD_NO_STL, false)),
	noListing: z
		.boolean()
		.optional()
		.default(parseBooleanEnv(env.ELEVENTY_SCAD_NO_LISTING, true)),
});

function parseBooleanEnv(val: unknown, defaultVal: boolean): boolean {
	if (typeof val === "boolean") return val;
	if (typeof val === "string") {
		const v = val.trim().toLowerCase();
		if (["true", "1"].includes(v)) return true;
		if (["false", "0"].includes(v)) return false;
	}
	return defaultVal;
}
