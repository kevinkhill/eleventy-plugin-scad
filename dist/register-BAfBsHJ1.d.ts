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
  launchPath: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodOptional<z.ZodString>>;
  theme: z.ZodPipe<z.ZodOptional<z.ZodEnum<{
    Traditional: "Traditional";
    Modernist: "Modernist";
    Midnight: "Midnight";
    Chocolate: "Chocolate";
    Oldstyle: "Oldstyle";
    Steely: "Steely";
    Swiss: "Swiss";
    Ultramarine: "Ultramarine";
  }>>, z.ZodTransform<"Traditional" | "Modernist" | "Midnight" | "Chocolate" | "Oldstyle" | "Steely" | "Swiss" | "Ultramarine", "Traditional" | "Modernist" | "Midnight" | "Chocolate" | "Oldstyle" | "Steely" | "Swiss" | "Ultramarine" | undefined>>;
  layout: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  resolveLaunchPath: z.ZodDefault<z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodUnion<readonly [z.ZodBoolean, z.ZodCodec<z.ZodString, z.ZodBoolean>]>>>;
  collectionPage: z.ZodDefault<z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodUnion<readonly [z.ZodBoolean, z.ZodCodec<z.ZodString, z.ZodBoolean>]>>>;
  verbose: z.ZodDefault<z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodUnion<readonly [z.ZodBoolean, z.ZodCodec<z.ZodString, z.ZodBoolean>]>>>;
  silent: z.ZodDefault<z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodUnion<readonly [z.ZodBoolean, z.ZodCodec<z.ZodString, z.ZodBoolean>]>>>;
  noSTL: z.ZodDefault<z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodUnion<readonly [z.ZodBoolean, z.ZodCodec<z.ZodString, z.ZodBoolean>]>>>;
}, z.core.$strip>;
declare namespace types_d_exports {
  export { DockerLaunchId, DockerTag, EleventyDirs, FullPageData, LaunchPath, MainPlatforms, ModelViewerTheme, ParsedPluginOptions, PlatformMap, PluginOptions, PluginOptionsInput, ScadTemplateData };
}
import * as import__11ty_ts from "11ty.ts";
__reExport(types_d_exports, import__11ty_ts);
type DockerTag = (typeof DOCKER_TAGS)[number];
type DockerLaunchId = "docker" | `docker:${DockerTag}`;
type ModelViewerTheme = (typeof THEMES)[number];
type PluginOptions = z.infer<typeof PluginOptionsSchema>;
type ParsedPluginOptions = z.output<typeof PluginOptionsSchema>;
type LaunchPath = "auto" | "nightly" | DockerLaunchId;
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
//#region src/core/register.d.ts
declare function addOpenSCADPlugin(eleventyConfig: types_d_exports.EleventyConfig, options: PluginOptionsInput): void;
//#endregion
export { DockerLaunchId, DockerTag, EleventyDirs, FullPageData, LaunchPath, MainPlatforms, ModelViewerTheme, ParsedPluginOptions, PlatformMap, PluginOptions, PluginOptionsInput, ScadTemplateData, __export, __reExport, addOpenSCADPlugin, types_d_exports };