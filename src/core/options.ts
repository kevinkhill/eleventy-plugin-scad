import { env, platform } from "node:process";
import z from "zod";
import { THEMES } from "./const";
import { autoBinPath } from "./scad-bin";
import type { ModelViewerTheme } from "../types";

const StringBoolSchema = z.union([z.boolean(), z.stringbool()]);

const createStringBoolSchema = (opts: { envvar: string; default: boolean }) => {
	return z
		.preprocess((val) => val ?? env[opts.envvar], StringBoolSchema)
		.default(opts.default);
};

export const PluginOptionsSchema = z.object({
	launchPath: z.preprocess((val) => {
		if (val === null || val === "auto" || val === "nightly") {
			return autoBinPath(platform, val ?? "auto");
		}
		return val;
	}, z.string().optional()),
	layout: z.string().nullish(),
	theme: z
		.enum(THEMES)
		.optional()
		.prefault(parseStringEnv<ModelViewerTheme>("ELEVENTY_SCAD_THEME"))
		.default("Midnight"),
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
