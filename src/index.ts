import { defineConfig } from "11ty.ts";
import { registerOpenSCADPlugin } from "./lib/register";
import EleventyPluginOpenSCAD from "./plugin";

// import scadPlugin from "11ty-plugin-scad";
export default EleventyPluginOpenSCAD;

// import { OpenSCAD } from "11ty-plugin-scad";
export const OpenSCAD = EleventyPluginOpenSCAD;

// Type safe helpers
export { defineConfig, registerOpenSCADPlugin };

export type * from "./types";
