import z from "zod";
import { EleventyScope, EleventySuppliedData } from "11ty.ts";

//#region rolldown:runtime
//#endregion
//#region src/core/const.d.ts
declare const THEMES: readonly ["Traditional", "Modernist", "Midnight", "Chocolate", "Oldstyle", "Steely", "Swiss", "Ultramarine"];
//#endregion
//#region src/core/options.d.ts
declare const PluginOptionsSchema: z.ZodObject<{
  launchPath: z.ZodPipe<z.ZodTransform<{} | null | undefined, unknown>, z.ZodOptional<z.ZodString>>;
  layout: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  theme: z.ZodDefault<z.ZodPrefault<z.ZodOptional<z.ZodEnum<{
    Traditional: "Traditional";
    Modernist: "Modernist";
    Midnight: "Midnight";
    Chocolate: "Chocolate";
    Oldstyle: "Oldstyle";
    Steely: "Steely";
    Swiss: "Swiss";
    Ultramarine: "Ultramarine";
  }>>>>;
  checkLaunchPath: z.ZodDefault<z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodUnion<readonly [z.ZodBoolean, z.ZodCodec<z.ZodString, z.ZodBoolean>]>>>;
  collectionPage: z.ZodDefault<z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodUnion<readonly [z.ZodBoolean, z.ZodCodec<z.ZodString, z.ZodBoolean>]>>>;
  verbose: z.ZodDefault<z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodUnion<readonly [z.ZodBoolean, z.ZodCodec<z.ZodString, z.ZodBoolean>]>>>;
  silent: z.ZodDefault<z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodUnion<readonly [z.ZodBoolean, z.ZodCodec<z.ZodString, z.ZodBoolean>]>>>;
  noSTL: z.ZodDefault<z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodUnion<readonly [z.ZodBoolean, z.ZodCodec<z.ZodString, z.ZodBoolean>]>>>;
}, z.core.$strip>;
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
 * Returns the OpenSCAD binary path for the current platform.
 */
declare namespace types_d_exports {
  export { EleventyDirs, FullPageData, MainPlatforms, ModelViewerTheme, ParsedPluginOptions, PlatformMap, PluginOptions, PluginOptionsInput, ScadTemplateData };
}
import * as import__11ty_ts from "11ty.ts";
__reExport(types_d_exports, import__11ty_ts);
type ModelViewerTheme = (typeof THEMES)[number];
type PluginOptions = z.infer<typeof PluginOptionsSchema>;
type ParsedPluginOptions = z.output<typeof PluginOptionsSchema>;
type PluginOptionsInput = Omit<z.input<typeof PluginOptionsSchema>, "launchPath"> & {
  launchPath: "auto" | "nightly" | (string & {});
};
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
type MainPlatforms = Extract<"linux" | "darwin" | "win32", NodeJS.Platform>;
type PlatformMap = Record<MainPlatforms, string>;
//#endregion
//#region src/plugin.d.ts
/**
 * Eleventy Plugin for OpenSCAD
 *
 * @param {EleventyConfig} eleventyConfig
 * @param {PluginOptionsInput} options
 */
declare function EleventyPluginOpenSCAD(eleventyConfig: types_d_exports.EleventyConfig, options: PluginOptionsInput): void;
//#endregion
//#region src/lib/register.d.ts
declare function addOpenSCADPlugin(eleventyConfig: types_d_exports.EleventyConfig, options: PluginOptionsInput): void;
declare namespace index_d_exports {
  export { EleventyDirs, EleventyPluginOpenSCAD, FullPageData, MainPlatforms, ModelViewerTheme, ParsedPluginOptions, PlatformMap, PluginOptions, PluginOptionsInput, SCAD_BINS, ScadTemplateData, addOpenSCADPlugin, EleventyPluginOpenSCAD as default };
}
__reExport(index_d_exports, types_d_exports);

//#endregion
export { EleventyDirs, EleventyPluginOpenSCAD, FullPageData, MainPlatforms, ModelViewerTheme, ParsedPluginOptions, PlatformMap, PluginOptions, PluginOptionsInput, SCAD_BINS, ScadTemplateData, addOpenSCADPlugin, EleventyPluginOpenSCAD as default };