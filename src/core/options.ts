import { existsSync } from "node:fs";
import z from "zod";

const ELEVENTY_SCAD_NO_STL = process.env.ELEVENTY_SCAD_NO_STL;
const ELEVENTY_SCAD_NO_LISTING = process.env.ELEVENTY_SCAD_NO_LISTING;

/**
 * Eleventy OpenSCAD Plugin Options
 *
 * - **launchPath**: Location of the OpenSCAD executable
 * - **layout**: Use a custom layout for the scad files
 * - **noSTL**: Set `true` to skip generating STLs
 */
export default z.object({
	launchPath: z.string().refine((val) => {
		if (!existsSync(val)) return `Does Not Exist: ${val}`;
		return true;
	}),
	layout: z.string().optional().nullish(),
	noSTL: z
		.boolean()
		.optional()
		.default(ELEVENTY_SCAD_NO_STL ? Boolean(ELEVENTY_SCAD_NO_STL) : false),
	noListing: z
		.boolean()
		.optional()
		.default(
			ELEVENTY_SCAD_NO_LISTING ? Boolean(ELEVENTY_SCAD_NO_LISTING) : false,
		),
});
