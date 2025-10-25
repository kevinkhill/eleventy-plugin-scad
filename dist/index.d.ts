import z from "zod";
import { EleventyScope, EleventySuppliedData } from "11ty.ts";

//#region rolldown:runtime

//#endregion
//#region src/core/options.d.ts
declare const PluginOptionsSchema: z.ZodObject<{
  launchPath: z.ZodString;
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
}, z.core.$strip>;
//#endregion
//#region src/types/core.d.ts
type MaybePluginOptions = z.input<typeof PluginOptionsSchema>;
type PluginOptions = z.infer<typeof PluginOptionsSchema>;
type StlViewerThemes = PluginOptions["theme"];
type ScadTemplateData = {
  layout: string;
  title: string;
  tags: string[];
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
declare namespace index_d_exports$1 {
  export { EleventyDirs, FullPageData, MaybePluginOptions, PluginOptions, ScadTemplateData, StlViewerThemes };
}
import * as import__11ty_ts from "11ty.ts";
__reExport(index_d_exports$1, import__11ty_ts);

//#endregion
//#region src/plugin.d.ts
/**
 * Eleventy Plugin for OpenSCAD
 *
 * @param {EleventyConfig} eleventyConfig
 * @param {MaybePluginOptions} options
 */
declare function export_default(eleventyConfig: index_d_exports$1.EleventyConfig, options: MaybePluginOptions): void;
//#endregion
//#region src/core/scad-bin.d.ts
declare const SCAD_BIN: {
  readonly LINUX: "openscad";
  readonly LINUX_NIGHTLY: "openscad-nightly";
  readonly MACOS: "/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD";
  readonly WINDOWS: "C:/Program Files/Openscad/openscad.exe";
  readonly WINDOWS_NIGHTLY: "C:/Program Files/Openscad/openscad-nightly.exe";
};
declare const PLATFORM_MAP_SCAD_BIN: Partial<Record<NodeJS.Platform, string>>;
/**
 * Helper function that attempts to get the bin path based on `os.platform()`
 */
declare function detectBinFromPlatfrom(): string;
/**
 * Helper function to return the path to OpenSCAD if you installed
 * it in your user folder `~/Applications/`
 */
declare function macosUserInstalledOpenSCAD(): string;
//#endregion
//#region src/lib/register.d.ts
declare function addOpenSCADPlugin(eleventyConfig: index_d_exports$1.EleventyConfig, options: MaybePluginOptions): void;
declare namespace index_d_exports {
  export { EleventyDirs, export_default as EleventyPluginOpenSCAD, FullPageData, MaybePluginOptions, PLATFORM_MAP_SCAD_BIN, PluginOptions, SCAD_BIN, ScadTemplateData, StlViewerThemes, addOpenSCADPlugin, export_default as default, detectBinFromPlatfrom, macosUserInstalledOpenSCAD };
}
__reExport(index_d_exports, index_d_exports$1);

//#endregion
export { EleventyDirs, export_default as EleventyPluginOpenSCAD, FullPageData, MaybePluginOptions, PLATFORM_MAP_SCAD_BIN, PluginOptions, SCAD_BIN, ScadTemplateData, StlViewerThemes, addOpenSCADPlugin, export_default as default, detectBinFromPlatfrom, macosUserInstalledOpenSCAD };