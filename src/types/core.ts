import type { EleventyScope, EleventySuppliedData } from "11ty.ts";
import type z from "zod";
import type PluginOptionsSchema from "../core/options";

export type MaybePluginOptions = z.input<typeof PluginOptionsSchema>;
export type PluginOptions = z.infer<typeof PluginOptionsSchema>;

export type ScadTemplateData = {
	title: string;
	scadFile: string;
	stlFile: string;
	stlUrl: string;
	layout: string;
	tags: string[];
};

export type FullPageData = EleventyScope &
	ScadTemplateData & {
		collections: {
			all: EleventySuppliedData[];
			scad: ScadTemplateData[];
		};
	};
