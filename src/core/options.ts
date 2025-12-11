import z from "zod";
import { DEFAULT_DOCKER_TAG, DEFAULT_PLUGIN_THEME } from "../config";
import { autoBinPath, Debug } from "../lib";
import { getOptionsFromEnv } from "../lib/env";
import { COLOR_SCHEMES, SCAD_VIEWER_LAYOUT, THEMES } from "./const";
import type { PluginOptions } from "../types";

/**
 * Default plugin options
 */
export const DEFAULT_OPTIONS = {
	launchPath: `docker:${DEFAULT_DOCKER_TAG}`,
	theme: DEFAULT_PLUGIN_THEME,
	layout: SCAD_VIEWER_LAYOUT,
	resolveLaunchPath: true,
	collectionPage: true,
	collectionPageTitle: "SCAD Collection",
	thumbnailColorScheme: "Cornfield",
	verbose: true,
	noSTL: false,
	silent: false,
} satisfies PluginOptions;

const debug = Debug.extend("options");

const StringBoolSchema = z.union([z.boolean(), z.stringbool()]);

export const PluginOptionsSchema = z.object({
	launchPath: z.preprocess((val) => {
		if (val === "auto" || val === "nightly") {
			return autoBinPath(process.platform, val ?? "auto");
		}
		return val;
	}, z.string().default(DEFAULT_OPTIONS.launchPath)),
	layout: z.optional(z.string()).default(DEFAULT_OPTIONS.layout),
	theme: z.optional(z.enum(THEMES)).default(DEFAULT_OPTIONS.theme),
	noSTL: z.optional(StringBoolSchema).default(DEFAULT_OPTIONS.noSTL),
	silent: z.optional(StringBoolSchema).default(DEFAULT_OPTIONS.silent),
	verbose: z.optional(StringBoolSchema).default(DEFAULT_OPTIONS.verbose),
	collectionPage: z
		.optional(StringBoolSchema)
		.default(DEFAULT_OPTIONS.collectionPage),
	collectionPageTitle: z
		.optional(z.string())
		.default(DEFAULT_OPTIONS.collectionPageTitle),
	thumbnailColorScheme: z
		.optional(z.enum(COLOR_SCHEMES))
		.default(DEFAULT_OPTIONS.thumbnailColorScheme),
	resolveLaunchPath: z
		.optional(StringBoolSchema)
		.default(DEFAULT_OPTIONS.resolveLaunchPath),
});

export function parseOptions(options: unknown, env = process.env) {
	const envOptions = getOptionsFromEnv(env);
	debug("environment: %O", envOptions);
	debug("user: %O", options);
	const mergedOptions = Object.assign({}, envOptions, options);
	debug("merged: %O", mergedOptions);
	const parsedOptions = PluginOptionsSchema.safeParse(mergedOptions);
	debug("parsed: %O", parsedOptions);
	return parsedOptions;
}

//   --colorscheme arg                 =colorscheme: *Cornfield | Metallic |
//                                     Sunset | Starnight | BeforeDawn | Nature |
//                                     Daylight Gem | Nocturnal Gem | DeepOcean |
//                                     Solarized | Tomorrow | Tomorrow Night |
//                                     ClearSky | Monotone
