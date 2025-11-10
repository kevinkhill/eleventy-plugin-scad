import { name, version } from "../../package.json" with { type: "json" };

export const PLUGIN_NAME = name;

export const PLUGIN_VERSION = version;

export const THREE_JS_VERSION = "0.180.0";

export const LIL_GUI_VERSION = "0.21";

export const THEMES = [
	"Traditional",
	"Modernist",
	"Midnight",
	"Chocolate",
	"Oldstyle",
	"Steely",
	"Swiss",
	"Ultramarine",
] as const;

export const DEFAULT_SCAD_LAYOUT = "scad.viewer.njk";

export const DEFAULT_COLLECTION_LAYOUT = "scad.collection.njk";

export const DEFAULT_PLUGIN_THEME: (typeof THEMES)[number] = "Traditional";

export const STL_EXT = "stl";

export const DOT_STL = `.${STL_EXT}`;

export const SCAD_EXT = "scad";

export const DOT_SCAD = `.${SCAD_EXT}`;
