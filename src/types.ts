import type { EleventyScope, EleventySuppliedData } from "11ty.ts";
import type z from "zod";
import type { PluginOptionsSchema, THEMES } from "./core";

export type * from "11ty.ts";

export type ModelViewerTheme = (typeof THEMES)[number];

export type PluginOptions = z.infer<typeof PluginOptionsSchema>;

export type ParsedPluginOptions = z.output<typeof PluginOptionsSchema>;

export type PluginOptionsInput = Omit<
	z.input<typeof PluginOptionsSchema>,
	"launchPath"
> & {
	launchPath: "auto" | "nightly" | "docker" | (string & {});
};

export type DockerTag = "latest" | "trixie" | "bookworm" | (string & {});

export type ScadTemplateData = {
	layout: string;
	title: string;
	tags: string[];
	theme: string;
	slug: string;
	scadFile: string;
	stlFile: string;
};

export type FullPageData = EleventyScope &
	ScadTemplateData & {
		collections: {
			all: EleventySuppliedData[];
			scad: ScadTemplateData[];
		};
	};

export type EleventyDirs = {
	input: string;
	inputFile?: string;
	inputGlob?: string;
	data: string;
	includes: string;
	layouts?: string;
	output: string;
};

export type MainPlatforms = Extract<
	"linux" | "darwin" | "win32",
	NodeJS.Platform
>;

export type PlatformMap = Record<MainPlatforms, string>;
