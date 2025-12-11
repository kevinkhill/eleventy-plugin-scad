import type { EleventyScope, EleventySuppliedData } from "11ty.ts";
import type z from "zod";
import type { DOCKER_TAGS, PluginOptionsSchema, THEMES } from "./core";

export type * from "11ty.ts";

export type DockerTag = (typeof DOCKER_TAGS)[number];

export type ExportFormat = "stl" | "png";

export type DockerLaunchTag = `docker:${DockerTag}`;

export type LaunchPath = "auto" | "nightly" | "docker" | DockerLaunchTag;

export type ModelViewerTheme = (typeof THEMES)[number];

export type ScadExportResult = {
	ok: boolean;
	output: string[];
	exitCode: number | null;
	duration: number;
};

export type Files = {
	cwd: string;
	in: string;
	out: string;
};

export type PluginOptions = {
	launchPath: LaunchPath | (string & {});
	theme?: ModelViewerTheme;
	layout?: string | null;
	resolveLaunchPath?: boolean;
	collectionPage?: boolean;
	verbose?: boolean;
	noSTL?: boolean;
	silent?: boolean;
};

export type ParsedPluginOptions = z.output<typeof PluginOptionsSchema>;

export type PluginOptionsInput = Omit<
	z.input<typeof PluginOptionsSchema>,
	"launchPath"
> & {
	launchPath: LaunchPath | (string & {});
};

/**
 * Data passed into SCAD templates.
 */
export interface ScadTemplateData {
	/** Title of the generated page */
	title: string;

	/** Slug created from the filename without extension */
	slug: string;

	/** Relative path to the `.scad` input file */
	scadFile: string;

	/** Output STL filename (e.g., `model.stl`) */
	stlFile: string;

	/** Name of the layout file (e.g., `scad.viewer.njk`) */
	layout: string;

	/** Theme name for the viewer */
	theme: string;

	/** Tags added to the generated page */
	tags: string[];
}

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
