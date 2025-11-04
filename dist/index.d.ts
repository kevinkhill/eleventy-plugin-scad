import z from "zod";
import { EleventyConfig, EleventyScope, EleventySuppliedData } from "11ty.ts";

//#region src/core/options.d.ts
declare const PluginOptionsSchema: z.ZodObject<{
  launchPath: z.ZodPipe<z.ZodPrefault<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"auto">, z.ZodLiteral<"nightly">, z.ZodString]>>>>, z.ZodTransform<string, string | null>>;
  layout: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  theme: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    Traditional: "Traditional";
    Modernist: "Modernist";
    Midnight: "Midnight";
    Chocolate: "Chocolate";
    Oldstyle: "Oldstyle";
    Steely: "Steely";
    Swiss: "Swiss";
    Ultramarine: "Ultramarine";
  }>>>;
  collectionPage: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
  verbose: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
  silent: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
  noSTL: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
  checkLaunchPath: z.ZodDefault<z.ZodUnion<readonly [z.ZodBoolean, z.ZodPrefault<z.ZodCodec<z.ZodString, z.ZodBoolean>>]>>;
}, z.core.$strip>;
//#endregion
//#region src/lib/types.d.ts
type MaybePluginOptions = z.input<typeof PluginOptionsSchema>;
type PluginOptions = z.infer<typeof PluginOptionsSchema>;
type StlViewerThemes = PluginOptions["theme"];
type ScadTemplateData = {
  layout: string;
  title: string;
  tags: string[];
  theme: string;
  slug: string;
  scadFile: string;
  stlFile: string;
};
type FullPageData = EleventyScope & ScadTemplateData & {
  collections: {
    all: EleventySuppliedData[];
    scad: ScadTemplateData[];
  };
};
type EleventyDirs = {
  input: string;
  inputFile?: string;
  inputGlob?: string;
  data: string;
  includes: string;
  layouts?: string;
  output: string;
};
//#endregion
//#region src/plugin.d.ts
/**
 * Eleventy Plugin for OpenSCAD
 *
 * @param {EleventyConfig} eleventyConfig
 * @param {MaybePluginOptions} options
 */
declare function export_default(eleventyConfig: EleventyConfig, options: MaybePluginOptions): void;
//#endregion
//#region src/core/scad-bin.d.ts
/**
 * Alias mappings to use when installing the plugin into an eleventy project.
 *
 * @example ```
 * import Eleventy from "@11ty/eleventy";
 * import { EleventyPluginOpenSCAD, SCAD_BINS } from "eleventy-plugin-scad";
 *
 * const launchPath = SCAD_BINS.MACOS;
 *```
 */
declare const SCAD_BINS: {
  readonly LINUX: string;
  readonly LINUX_NIGHTLY: string;
  readonly MACOS: string;
  readonly MACOS_NIGHTLY: string;
  readonly WINDOWS: string;
  readonly WINDOWS_NIGHTLY: string;
};
/**
 * Helper: Returns the OpenSCAD binary path for the current platform.
 * @param nightly - Whether to use the nightly build
 */
//#endregion
//#region src/lib/register.d.ts
declare function addOpenSCADPlugin(eleventyConfig: EleventyConfig, options: MaybePluginOptions): void;
//#endregion
export { type EleventyConfig, EleventyDirs, export_default as EleventyPluginOpenSCAD, FullPageData, MaybePluginOptions, PluginOptions, SCAD_BINS, ScadTemplateData, StlViewerThemes, addOpenSCADPlugin, export_default as default };