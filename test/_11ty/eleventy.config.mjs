import { homedir } from "node:os";
import { join } from "node:path";
import { addOpenSCADPlugin, SCAD_BIN } from "../../dist/index.js";

/** @param {import("@11ty/eleventy/UserConfig").default} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.setInputDirectory("input");
  eleventyConfig.setOutputDirectory("output");
  eleventyConfig.addWatchTarget("../../dist/index.js");

  /**
   * Helper function to type-hint the plugin's options
   */
  addOpenSCADPlugin(eleventyConfig, {
    /**
     * Command to launch openscad.
     *
     * Either the path to the openscad executable, or just "openscad" (no quotes) if the executable is in the path.
     *
     * If left blank, it will use the default path for your system noted below:
     * - Windows: C:\Program Files\Openscad\openscad.exe
     * - MacOS: /Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD
     * - Linux: openscad (Automatically in path)
     */
    launchPath: join(homedir(), SCAD_BIN.MACOS),
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
