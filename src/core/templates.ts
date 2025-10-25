import { getAssetFile } from "../lib/assets";
import { DEFAULT_COLLECTION_LAYOUT, DEFAULT_SCAD_LAYOUT } from "../lib/const";
import type { EleventyConfig } from "../types";

export function addBuiltinScadLayoutVirtualTemplate(
	eleventyConfig: EleventyConfig,
) {
	eleventyConfig.addTemplate(
		`_includes/${DEFAULT_SCAD_LAYOUT}`,
		getAssetFile(DEFAULT_SCAD_LAYOUT),
		{},
	);
}

export function addScadCollectionVirtualTemplate(
	eleventyConfig: EleventyConfig,
) {
	eleventyConfig.addTemplate(
		`_includes/${DEFAULT_COLLECTION_LAYOUT}`,
		getAssetFile(DEFAULT_COLLECTION_LAYOUT),
		{},
	);
	eleventyConfig.addTemplate(
		`index.njk`,
		`<ul>
			{% for item in collections.scad %}
          		<li><a href="/{{ item.data.slug }}">{{ item.data.title }}</a></li>
        	{% endfor %}
		</ul>`,
		{
			layout: DEFAULT_COLLECTION_LAYOUT,
		},
	);
}
