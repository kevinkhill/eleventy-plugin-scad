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

export const theme = (t: PluginTheme) => t;

export type PluginTheme = (typeof THEMES)[number];
