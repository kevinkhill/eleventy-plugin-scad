import type { EleventyScope, EleventySuppliedData } from "11ty.ts";
import type { PluginOptions } from "./core/options";

export type * from "11ty.ts";
export type StlViewerThemes = PluginOptions["theme"];

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
