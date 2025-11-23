import { name, version } from "../../package.json" with { type: "json" };

export const PLUGIN_NAME = name;

export const PLUGIN_VERSION = version;

export const STL_EXT = "stl";

export const DOT_STL = `.${STL_EXT}`;

export const SCAD_EXT = "scad";

export const DOT_SCAD = `.${SCAD_EXT}`;

export const SCAD_VIEWER_LAYOUT = "scad.viewer.njk";

export const SCAD_COLLECTION_LAYOUT = "scad.collection.njk";

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

export const DOCKER_TAGS = [
	"trixie",
	"dev",
	"bookworm",
	"2021.01",
	"latest",
] as const;
