# eleventy-plugin-scad

A plugin for Eleventy to showcase your SCAD files.

![NPM Version](https://img.shields.io/npm/v/eleventy-plugin-scad)

## Purpose
Use Eleventy to generate a site to showcase your OpenSCAD models. This plugin adds `.scad` as a template and will use your system's OpenSCAD to render the file into an STL. An additional HTML file with Three.js STL viewer is gererated as well.

## Install into Project

```bash
npm install eleventy-plugin-scad
```

## Plugin Options

- **launchPath** _(string)_: Location of the OpenSCAD executable (required)
  - `auto` - Attempts to use `process.platform` to find OpenSCAD in the default install locations
  - `nightly` - Works the same as above for the `nightly` version of OpenSCAD
  - `"C:/openscad.exe"` - Absolute paths work too.
  - `osc` - Maybe you aliased OpenSCAD and have it on your `$PATH`
- **layout**: Use a custom layout for the scad files
- **collectionPage**: Set `true` to generate a listing page from `collections.scad`
- **verbose**: Set `true` to view the compilation output from OpenSCAD
- **noSTL**: Set `true` to skip generating STLs
- **silent**: Set `true` to disable all logging from the plugin

## Add Plugin to Eleventy

There are two methods to add the plugin to Eleventy.

### Method 1

Using a helper function bound to the plugin, we can pass in the `eleventyConfig` and get type-hints for the plugin's options. The helper calls `addPlugin()` with the options applied.

```js
import { addOpenSCADPlugin } from "eleventy-plugin-scad";

/** @param {import("@11ty/eleventy/UserConfig").default} eleventyConfig */
export default function (eleventyConfig) {
  addOpenSCADPlugin(eleventyConfig, {
    launchPath: "auto",
    verbose: true,
  });
}
```

### Method 2

This is the canonical way to install plugins according to the Eleventy documentation. There is no type-hinting with this method.

```js
import { EleventyPluginOpenSCAD } from "eleventy-plugin-scad";

/** @param {import("@11ty/eleventy/UserConfig").default} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyPluginOpenSCAD, {
    launchPath: "auto",
    verbose: true,
  });
}
```

## Launch Path Tips

If you are on a Mac and installed OpenSCAD into `~/Applications` instead of the default location, here is a handy way to reference it for the `launchPath`.

```js
import { homedir } from "node:os";
import { join } from "node:path";
import { addOpenSCADPlugin, SCAD_BINS } from "eleventy-plugin-scad";

/** @param {import("@11ty/eleventy/UserConfig").default} eleventyConfig */
export default async (eleventyConfig) => {
  addOpenSCADPlugin(eleventyConfig, {
    // SCAD_BINS.MACOS => "/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD"
    launchPath: join(homedir(), SCAD_BINS.MACOS),
  });
};
```
