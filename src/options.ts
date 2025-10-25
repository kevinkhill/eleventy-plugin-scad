import z from "zod";
import { existsSync } from "node:fs";

/**
 * Eleventy OpenSCAD Plugin Options
 *
 * - **launchPath**: Location of the OpenSCAD executable
 * - **layout**: Use a custom layout for the scad files
 * - **noSTL**: Set `true` to skip generating STLs
 */
const PluginOptionsSchema = z.strictObject({
  launchPath: z.string().refine((val) => {
    if (!existsSync(val)) return `Does Not Exist: ${val}`;
    return true;
  }),
  layout: z.string().optional(),
  noSTL: z.boolean().optional().default(false),
});

export default PluginOptionsSchema;

export type PluginOptions = z.infer<typeof PluginOptionsSchema>;
