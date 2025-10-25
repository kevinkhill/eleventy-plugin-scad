import { SCAD_BIN } from "./core";
import { addOpenSCADPlugin } from "./lib";
import EleventyPluginOpenSCAD from "./plugin";

/**
 * Public Methods
 */
export default EleventyPluginOpenSCAD;
export {
	EleventyPluginOpenSCAD, // The Plugin
	addOpenSCADPlugin, // Helper function to type-hint plugin options
	SCAD_BIN, // Path Helpers,
};

/**
 * Public Types
 */
export type * from "./types";
