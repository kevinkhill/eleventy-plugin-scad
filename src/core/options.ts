import { existsSync } from "node:fs";
import { env } from "node:process";
import z from "zod";

const OptBoolSchema = z.boolean().optional();

export const ThemeSchema = z.enum([
	"Chocolate",
	"Midnight",
	"Modernist",
	"Oldstyle",
	"Steely",
	"Swiss",
	"Traditional",
	"Ultramarine",
]);

export const PluginOptionsSchema = z.object({
	launchPath: z.string().refine((val) => {
		if (!existsSync(val)) return `Does Not Exist: ${val}`;
		return true;
	}),
	layout: z.string().nullish(),
	theme: ThemeSchema.optional().default(
		parseStringEnv<z.infer<typeof ThemeSchema>>(
			"ELEVENTY_SCAD_THEME",
			"Traditional",
		),
	),
	collectionPage: OptBoolSchema.default(
		parseBooleanEnv("ELEVENTY_SCAD_COLLECTION_PAGE", true),
	),
	verbose: OptBoolSchema.default(
		parseBooleanEnv("ELEVENTY_SCAD_VERBOSE", false),
	),
	silent: OptBoolSchema.default(
		parseBooleanEnv("ELEVENTY_SCAD_VERBOSE", false),
	),
	noSTL: OptBoolSchema.default(parseBooleanEnv("ELEVENTY_SCAD_NO_STL", false)),
});

function parseStringEnv<T>(envvar: string, defaultVal: T): T {
	const val = env[envvar];
	if (typeof val === "string") {
		if (val.length > 0) return val as T;
		return defaultVal;
	}
	return defaultVal;
}

function parseBooleanEnv(envvar: string, defaultVal: boolean): boolean {
	const val = env[envvar];
	if (typeof val === "boolean") return val;
	if (typeof val === "string") {
		const v = val.trim().toLowerCase();
		if (["true", "1"].includes(v)) return true;
		if (["false", "0"].includes(v)) return false;
	}
	return defaultVal;
}
