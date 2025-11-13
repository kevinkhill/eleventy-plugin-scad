import { DockerLaunchId, DockerTag, EleventyDirs, FullPageData, LaunchPath, MainPlatforms, ModelViewerTheme, ParsedPluginOptions, PlatformMap, PluginOptions, PluginOptionsInput, ScadTemplateData, __export, __reExport, addOpenSCADPlugin, types_d_exports } from "./register-BAfBsHJ1.js";

//#region src/plugin.d.ts

/**
 * Eleventy Plugin for OpenSCAD
 *
 * @param {EleventyConfig} eleventyConfig
 * @param {PluginOptionsInput} options
 */
declare function EleventyPluginOpenSCAD(eleventyConfig: types_d_exports.EleventyConfig, options: PluginOptionsInput): void;
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
declare namespace index_d_exports {
  export { DockerLaunchId, DockerTag, EleventyDirs, EleventyPluginOpenSCAD, FullPageData, LaunchPath, MainPlatforms, ModelViewerTheme, ParsedPluginOptions, PlatformMap, PluginOptions, PluginOptionsInput, SCAD_BINS, ScadTemplateData, addOpenSCADPlugin, EleventyPluginOpenSCAD as default };
}
__reExport(index_d_exports, types_d_exports);

//#endregion
export { DockerLaunchId, DockerTag, EleventyDirs, EleventyPluginOpenSCAD, FullPageData, LaunchPath, MainPlatforms, ModelViewerTheme, ParsedPluginOptions, PlatformMap, PluginOptions, PluginOptionsInput, SCAD_BINS, ScadTemplateData, addOpenSCADPlugin, EleventyPluginOpenSCAD as default };