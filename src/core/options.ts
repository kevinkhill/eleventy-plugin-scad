import { existsSync } from "node:fs";
import z from "zod";

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
	noSTL: z.boolean().optional().default(false),
	layout: z.string().optional().nullish(),
});
