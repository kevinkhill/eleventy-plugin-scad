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

export type PluginTheme = (typeof THEMES)[number];

// This is defined in `tsdown.config.js` and will be replaced during build
export const BUILD_TIME_DEFAULT_THEME = "__DEFAULT_THEME__" as PluginTheme;
