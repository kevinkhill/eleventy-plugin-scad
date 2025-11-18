import { Debug, getAssetFileContent } from "../lib";
import { DEFAULT_COLLECTION_LAYOUT, DEFAULT_SCAD_LAYOUT } from "./const";
import type { EleventyConfig } from "../types";

const log = Debug.extend("templates");

export function addBuiltinScadLayoutVirtualTemplate(
	eleventyConfig: EleventyConfig,
) {
	log(`(virtual) adding "%o"`, DEFAULT_SCAD_LAYOUT);
	eleventyConfig.addTemplate(
		`_includes/${DEFAULT_SCAD_LAYOUT}`,
		getAssetFileContent(DEFAULT_SCAD_LAYOUT),
		{},
	);
}

export function addScadCollectionVirtualTemplate(
	eleventyConfig: EleventyConfig,
) {
	log(`(virtual) adding "%o"`, DEFAULT_COLLECTION_LAYOUT);
	eleventyConfig.addTemplate(
		`_includes/${DEFAULT_COLLECTION_LAYOUT}`,
		getAssetFileContent(DEFAULT_COLLECTION_LAYOUT),
		{},
	);

	const DEFAULT_COLLECTION_TEMPLATE = "index.njk";
	eleventyConfig.addTemplate(
		DEFAULT_COLLECTION_TEMPLATE,
		`<ul>
			{% for item in collections.scad %}
          		<li><a href="{{ item.data.page.url | url }}">{{ item.data.title }}</a></li>
        	{% endfor %}
		</ul>`,
		{ layout: DEFAULT_COLLECTION_LAYOUT },
	);
	log(`(virtual) added "%o"`, DEFAULT_COLLECTION_TEMPLATE);
}
