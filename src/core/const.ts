import { name, version } from "../../package.json" with { type: "json" };

export const PLUGIN_NAME = name;

export const PLUGIN_VERSION = version;

export const STL_EXT = "stl";

export const DOT_STL = `.${STL_EXT}`;

export const SCAD_EXT = "scad";

export const DOT_SCAD = `.${SCAD_EXT}`;

export const SCAD_VIEWER_LAYOUT = "scad.viewer.njk";

export const SCAD_COLLECTION_LAYOUT = "scad.collection.njk";

/**
 * @link https://www.w3.org/StyleSheets/Core/Overview
 * @link https://www.w3.org/StyleSheets/Core/preview
 */
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

/**
 * @link https://hub.docker.com/r/openscad/openscad
 */
export const DOCKER_TAGS = [
	"trixie",
	"dev",
	"bookworm",
	"2021.01",
	"latest",
] as const;

/**
 * @link https://en.wikibooks.org/wiki/OpenSCAD_User_Manual/Using_OpenSCAD_in_a_command_line_environment#:~:text=colorscheme
 */
export const COLOR_SCHEMES = [
	"Cornfield",
	"Metallic",
	"Sunset",
	"Starnight",
	"BeforeDawn",
	"Nature",
	"Daylight Gem",
	"Nocturnal Gem",
	"DeepOcean",
	"Solarized",
	"Tomorrow",
	"Tomorrow Night",
	"ClearSky",
	"Monotone",
] as const;
