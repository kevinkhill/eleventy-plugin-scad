import z from "zod";
import { EleventyScope, EleventySuppliedData } from "11ty.ts";

//#region rolldown:runtime

//#endregion
//#region src/core/const.d.ts
declare const THEMES: readonly ["Traditional", "Modernist", "Midnight", "Chocolate", "Oldstyle", "Steely", "Swiss", "Ultramarine"];
declare const DOCKER_TAGS: readonly ["trixie", "dev", "bookworm", "2021.01", "latest"];
//#endregion
//#region src/core/options.d.ts
declare const PluginOptionsSchema: z.ZodObject<{
  launchPath: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodDefault<z.ZodString>>;
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
  noSTL: z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodCodec<z.ZodString, z.ZodBoolean>]>>>;
  silent: z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodCodec<z.ZodString, z.ZodBoolean>]>>>;
  verbose: z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodCodec<z.ZodString, z.ZodBoolean>]>>>;
  collectionPage: z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodCodec<z.ZodString, z.ZodBoolean>]>>>;
  resolveLaunchPath: z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodCodec<z.ZodString, z.ZodBoolean>]>>>;
}, z.core.$strip>;
declare namespace types_d_exports {
  export { DockerLaunchTag, DockerTag, EleventyDirs, FullPageData, LaunchPath, MainPlatforms, ModelViewerTheme, ParsedPluginOptions, PlatformMap, PluginOptions, PluginOptionsInput, ScadTemplateData };
}
import * as import__11ty_ts from "11ty.ts";
__reExport(types_d_exports, import__11ty_ts);
type DockerTag = (typeof DOCKER_TAGS)[number];
type DockerLaunchTag = `docker:${DockerTag}`;
type LaunchPath = "auto" | "nightly" | "docker" | DockerLaunchTag;
type ModelViewerTheme = (typeof THEMES)[number];
type PluginOptions = {
  launchPath: LaunchPath | (string & {});
  theme?: ModelViewerTheme;
  layout?: string | null;
  resolveLaunchPath?: boolean;
  collectionPage?: boolean;
  verbose?: boolean;
  noSTL?: boolean;
  silent?: boolean;
};
type ParsedPluginOptions = z.output<typeof PluginOptionsSchema>;
type PluginOptionsInput = Omit<z.input<typeof PluginOptionsSchema>, "launchPath"> & {
  launchPath: LaunchPath | (string & {});
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
//#region src/lib/scad-bin.d.ts
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
//#endregion
//#region src/plugin.d.ts
/**
 * Eleventy Plugin for OpenSCAD
 *
 * @param {EleventyConfig} eleventyConfig
 * @param {PluginOptionsInput} options
 */
declare function EleventyPluginOpenSCAD(eleventyConfig: types_d_exports.EleventyConfig, options: PluginOptionsInput): void;
declare namespace index_d_exports {
  export { DockerLaunchTag, DockerTag, EleventyDirs, EleventyPluginOpenSCAD, FullPageData, LaunchPath, MainPlatforms, ModelViewerTheme, ParsedPluginOptions, PlatformMap, PluginOptions, PluginOptionsInput, SCAD_BINS, ScadTemplateData, EleventyPluginOpenSCAD as default };
}
__reExport(index_d_exports, types_d_exports);

//#endregion
export { DockerLaunchTag, DockerTag, EleventyDirs, EleventyPluginOpenSCAD, FullPageData, LaunchPath, MainPlatforms, ModelViewerTheme, ParsedPluginOptions, PlatformMap, PluginOptions, PluginOptionsInput, SCAD_BINS, ScadTemplateData, EleventyPluginOpenSCAD as default };