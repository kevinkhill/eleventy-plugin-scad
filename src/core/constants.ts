export const SCAD_EXT = "scad";

export const DOT_SCAD = `.${SCAD_EXT}`;

export const DOT_STL = `.stl`;

export const SCAD_BIN = {
	MACOS: "/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD",
	WINDOWS: "C:/Program Files/Openscad/openscad.exe",
} as const;
