# 11ty-plugin-openscad

A plugin for Eleventy to showcase your SCAD files.

## Add to Eleventy Site

```bash
npm install 11ty-plugin-scad
```

## Plugin Options

- **launchPath**: Location of the OpenSCAD executable (required)
- **layout**: Use a custom layout for the scad files
- **collectionPage**: Set `true` to generate a listing page from `collections.scad`
- **verbose**: Set `true` to view the compilation output from OpenSCAD
- **noSTL**: Set `true` to skip generating STLs
- **silent**: Set `true` to disable all logging from the plugin


## Adding to Eleventy Config

### Method 1
This is the canonical way to install plugins according to the Eleventy documentation.


```js
import { EleventyPluginOpenSCAD, SCAD_BIN } from "eleventy-plugin-scad";

/** @param {import("@11ty/eleventy/UserConfig").default} eleventyConfig */
export default function (eleventyConfig) {
  // ...

  eleventyConfig.addPlugin(EleventyPluginOpenSCAD, {
    /**
     * Path to OpenSCAD binary
     */
    launchPath: SCAD_BIN.LINUX,
    // launchPath: SCAD_BIN.MACOS,
    // launchPath: SCAD_BIN.WINDOWS,
    /**
     * Log OpenSCAD's compilation output to the terminal
     */
    verbose: true,
    /**
     * Enable a listing page with links to the generated pages in the `scad` collection
     */
    collectionPage: true,
  });
}
```

### Method 2
This method uses a helper function to type-hint the plugin's options.
We flip the call by binding the plugin to the helper and passing in `eleventyConfig`. The helper calls `eleventyConfig.addPlugin()` with the options applied.

```js
import { addOpenSCADPlugin, SCAD_BIN } from "eleventy-plugin-scad";

/** @param {import("@11ty/eleventy/UserConfig").default} eleventyConfig */
export default function (eleventyConfig) {
  // ...

  addOpenSCADPlugin(eleventyConfig, {
    /**
     * Path to OpenSCAD binary
     */
    launchPath: SCAD_BIN.LINUX,
    // launchPath: SCAD_BIN.MACOS,
    // launchPath: SCAD_BIN.WINDOWS,
    /**
     * Log OpenSCAD's compilation output to the terminal
     */
    verbose: true,
    /**
     * Enable a listing page with links to the generated pages in the `scad` collection
     */
    collectionPage: true,
  });
}
```
