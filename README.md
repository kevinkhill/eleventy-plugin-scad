# 11ty-plugin-openscad

A plugin for Eleventy to showcase your SCAD files.

## Add to Eleventy Site

```bash
npm install 11ty-plugin-scad
```

## Add to Eleventy Config

```js
import { join } from "node:path";
import { addOpenSCADPlugin, SCAD_BIN } from "11ty-plugin-scad";

/** @param {import("@11ty/eleventy/UserConfig").default} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.setInputDirectory("input");
  eleventyConfig.setOutputDirectory("output");

  /**
   * Helper function to type-hint the plugin's options
   */
  addOpenSCADPlugin(eleventyConfig, {
    /**
     * Command to launch openscad
     */
    launchPath: SCAD_BIN.MACOS,
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

## Plugin Options

- **launchPath**: Location of the OpenSCAD executable (required)
- **layout**: Use a custom layout for the scad files
- **collectionPage**: Set `true` to generate a listing page from `collections.scad`
- **verbose**: Set `true` to view the compilation output from OpenSCAD
- **noSTL**: Set `true` to skip generating STLs
- **silent**: Set `true` to disable all logging from the plugin
