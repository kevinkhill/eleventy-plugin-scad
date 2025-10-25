import type { EleventyScope, EleventySuppliedData } from "11ty.ts";
import type z from "zod";
import type PluginOptionsSchema from "../core/options";

export type MaybePluginOptions = z.input<typeof PluginOptionsSchema>;
export type PluginOptions = z.infer<typeof PluginOptionsSchema>;

export type ScadTemplateData = {
	layout: string;
	title: string;
	tags: string[];
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
