import { env } from "node:process";
import z from "zod";
import { autoBinPath } from "./scad-bin";
import { BUILD_TIME_DEFAULT_THEME, THEMES } from "./themes";
import type { PluginTheme } from "./themes";

const OptBoolSchema = z.boolean().optional();

const envvar = (e: string) => String(env[e]);

export const PluginOptionsSchema = z.object({
	launchPath: z
		.union([z.literal("auto"), z.literal("nightly"), z.string()])
		.nullish()
		.prefault("auto")
		.transform((val) => {
			const isAuto = val === "auto";
			const isNightly = val === "nightly";
			if (!val || isAuto || isNightly) {
				return autoBinPath({ nightly: isNightly, noThrow: true });
			}
			return val;
		}),
	layout: z.string().nullish(),
	theme: z
		.enum(THEMES)
		// .prefault(env.ELEVENTY_SCAD_THEME)
		.optional()
		.default(
			parseStringEnv<PluginTheme>("ELEVENTY_SCAD_THEME") ??
				BUILD_TIME_DEFAULT_THEME,
		),
	// @TODO: Replace with z.stringbool
	collectionPage: OptBoolSchema.default(
		parseBooleanEnv("ELEVENTY_SCAD_COLLECTION_PAGE") ?? true,
	),
	// @TODO: Replace with z.stringbool
	verbose: OptBoolSchema.default(
		parseBooleanEnv("ELEVENTY_SCAD_VERBOSE") ?? false,
	),
	// @TODO: Replace with z.stringbool
	silent: OptBoolSchema.default(
		parseBooleanEnv("ELEVENTY_SCAD_VERBOSE") ?? false,
	),
	// @TODO: Replace with z.stringbool
	noSTL: OptBoolSchema.default(
		parseBooleanEnv("ELEVENTY_SCAD_NO_STL") ?? false,
	),
	checkLaunchPath: z
		.union([
			z.boolean(),
			z.stringbool().prefault(envvar("ELEVENTY_SCAD_CHECK_LAUNCH_PATH")),
		])
		.default(true),
});

export type PluginOptionsInput = Omit<
	z.input<typeof PluginOptionsSchema>,
	"launchPath"
> & {
	launchPath: "auto" | "nightly" | string;
};

export type ParsedPluginOptions = z.output<typeof PluginOptionsSchema>;

export type PluginOptions = z.infer<typeof PluginOptionsSchema>;

function parseStringEnv<T>(envvar: string): T | null {
	const val = env[envvar];
	if (typeof val === "string" && val.length > 0) return val as T;
	return null;
}

function parseBooleanEnv(envvar: string): boolean | null {
	const val = env[envvar];
	if (typeof val === "boolean") return val;
	if (typeof val === "string") {
		const v = val.trim().toLowerCase();
		if (["true", "1"].includes(v)) return true;
		if (["false", "0"].includes(v)) return false;
	}
	return null;
}
