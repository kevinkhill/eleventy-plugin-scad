import { env } from "node:process";
import z from "zod";
import { autoBinPath } from "./scad-bin";
import { THEMES, theme } from "./themes";
import type { PluginTheme } from "./themes";

const StringBoolSchema = z.union([z.boolean(), z.stringbool()]);

const createStringBoolSchema = (opts: { envvar: string; default: boolean }) => {
	return z
		.preprocess((val) => val ?? env[opts.envvar], StringBoolSchema)
		.default(opts.default);
};

export const PluginOptionsSchema = z.object({
	launchPath: z.preprocess((val) => {
		if (val === null || val === "auto" || val === "nightly") {
			return autoBinPath(val ?? "auto");
		}
		return val;
	}, z.string().optional()),
	layout: z.string().nullish(),
	theme: z
		.enum(THEMES)
		.optional()
		.prefault(parseStringEnv<PluginTheme>("ELEVENTY_SCAD_THEME"))
		.default(theme("Midnight")),
	collectionPage: createStringBoolSchema({
		envvar: "ELEVENTY_SCAD_COLLECTION_PAGE",
		default: true,
	}),
	verbose: createStringBoolSchema({
		envvar: "ELEVENTY_SCAD_VERBOSE",
		default: false,
	}),
	silent: createStringBoolSchema({
		envvar: "ELEVENTY_SCAD_SILENT",
		default: false,
	}),
	noSTL: createStringBoolSchema({
		envvar: "ELEVENTY_SCAD_NO_STL",
		default: false,
	}),
	checkLaunchPath: createStringBoolSchema({
		envvar: "ELEVENTY_SCAD_CHECK_LAUNCH_PATH",
		default: true,
	}),
});

function parseStringEnv<T>(envvar: string): T | undefined {
	const val = env[envvar];
	if (typeof val === "string" && val.length > 0) return val as T;
	return undefined;
}
