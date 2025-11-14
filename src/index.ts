import { addOpenSCADPlugin } from "./core/register";
import { SCAD_BINS } from "./lib/scad-bin";
import { EleventyPluginOpenSCAD } from "./plugin";

export default EleventyPluginOpenSCAD;
export { EleventyPluginOpenSCAD, addOpenSCADPlugin, SCAD_BINS };

export type * from "./types";
