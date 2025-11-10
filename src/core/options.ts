import { env, platform } from "node:process";
import z from "zod";
import Debug from "../lib/debug";
import { autoBinPath } from "../lib/scad-bin";
import { THEMES } from "./const";
import type { ModelViewerTheme } from "../types";

const debug = Debug.extend("zod");

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
	theme: z
		.optional(z.enum(THEMES))
		.superRefine((val, ctx) => {
			const envTheme = getEnv<ModelViewerTheme>("ELEVENTY_SCAD_THEME");
			const theme = val ?? envTheme;
			if (theme && !THEMES.includes(theme)) {
				ctx.addIssue({
					code: "custom",
					message: `Invalid theme: "${theme}". Must be one of [${THEMES.join("|")}]`,
				});
			}
		})
		.transform((val) => {
			const envTheme = getEnv<ModelViewerTheme>("ELEVENTY_SCAD_THEME");
			return val ?? envTheme ?? "Traditional";
		}),
	layout: z.nullish(z.string()),
	resolveLaunchPath: createStringBoolSchema({
		envvar: "ELEVENTY_SCAD_RESOLVE_LAUNCH_PATH",
		default: true,
	}),
	collectionPage: createStringBoolSchema({
		envvar: "ELEVENTY_SCAD_COLLECTION_PAGE",
		default: true,
	}),
	verbose: createStringBoolSchema({
		envvar: "ELEVENTY_SCAD_VERBOSE",
		default: true,
	}),
	silent: createStringBoolSchema({
		envvar: "ELEVENTY_SCAD_SILENT",
		default: false,
	}),
	noSTL: createStringBoolSchema({
		envvar: "ELEVENTY_SCAD_NO_STL",
		default: false,
	}),
});

export function parseOptions(options: unknown) {
	debug("incoming options: %O", options);
	const parsedOptions = PluginOptionsSchema.safeParse(options);
	debug("parsed options: %O", parsedOptions);
	return parsedOptions;
}

function getEnv<T>(envvar: string): T | undefined {
	const val = env[envvar];
	if (typeof val === "string" && val.length > 0) return val as T;
	return undefined;
}
