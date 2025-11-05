import { env } from "node:process";
import z from "zod";
import { autoBinPath } from "./scad-bin";
import { BUILD_TIME_DEFAULT_THEME, THEMES } from "./themes";
import type { PluginTheme } from "./themes";

const StringBoolSchema = z.union([z.boolean(), z.stringbool()]);

const envvar = (e: string) => String(env[e]);

export const PluginOptionsSchema = z.object({
	launchPath: z.preprocess((val) => {
		if (val === null || val === "auto" || val === "nightly") {
			return autoBinPath(val);
		}
		return val;
	}, z.string()),
	layout: z.string().nullish(),
	theme: z
		.enum(THEMES)
		// .prefault(env.ELEVENTY_SCAD_THEME)
		.optional()
		.default(
			parseStringEnv<PluginTheme>("ELEVENTY_SCAD_THEME") ??
				BUILD_TIME_DEFAULT_THEME,
		),
	collectionPage: z
		.prefault(StringBoolSchema, envvar("ELEVENTY_SCAD_COLLECTION_PAGE"))
		.default(true),
	verbose: z
		.prefault(StringBoolSchema, envvar("ELEVENTY_SCAD_VERBOSE"))
		.default(false),
	silent: z
		.prefault(StringBoolSchema, envvar("ELEVENTY_SCAD_VERBOSE"))
		.default(false),
	noSTL: z
		.prefault(StringBoolSchema, envvar("ELEVENTY_SCAD_NO_STL"))
		.default(false),
	checkLaunchPath: z
		.prefault(StringBoolSchema, envvar("ELEVENTY_SCAD_CHECK_LAUNCH_PATH"))
		.default(true),
});

function parseStringEnv<T>(envvar: string): T | undefined {
	const val = env[envvar];
	if (typeof val === "string" && val.length > 0) return val as T;
	return undefined;
}
