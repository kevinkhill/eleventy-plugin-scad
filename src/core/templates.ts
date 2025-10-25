import { debug, getAssetFile } from "../lib";
import type { EleventyConfig } from "../types";

export const DEFAULT_SCAD_LAYOUT = "scad.viewer.njk";

export const DEFAULT_COLLECTION_LAYOUT = "scad.collection.njk";

export function addBuiltinScadLayoutVirtualTemplate(
	eleventyConfig: EleventyConfig,
) {
	eleventyConfig.addTemplate(
		`_includes/${DEFAULT_SCAD_LAYOUT}`,
		getAssetFile(DEFAULT_SCAD_LAYOUT),
		{},
	);
	debug(`added virtual layout: %s`, DEFAULT_SCAD_LAYOUT);
}

export function addScadCollectionVirtualTemplate(
	eleventyConfig: EleventyConfig,
) {
	eleventyConfig.addTemplate(
		`_includes/${DEFAULT_COLLECTION_LAYOUT}`,
		getAssetFile(DEFAULT_COLLECTION_LAYOUT),
		{},
	);
	debug(`added virtual layout: %s`, DEFAULT_COLLECTION_LAYOUT);

	const DEFAULT_COLLECTION_TEMPLATE = "index.njk";

	eleventyConfig.addTemplate(
		DEFAULT_COLLECTION_TEMPLATE,
		`<ul>
			{% for item in collections.scad %}
          		<li><a href="/{{ item.data.slug }}">{{ item.data.title }}</a></li>
        	{% endfor %}
		</ul>`,
		{
			layout: DEFAULT_COLLECTION_LAYOUT,
		},
	);
	debug(`added virtual template: %s`, DEFAULT_COLLECTION_TEMPLATE);
}
