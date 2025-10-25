import { getAssetFile } from "../lib/assets";
import { DEFAULT_SCAD_LAYOUT } from "../lib/const";
import type { EleventyConfig } from "../types";

export function addBuiltinScadLayoutVirtualTemplate(
	eleventyConfig: EleventyConfig,
) {
	eleventyConfig.addTemplate(
		`_includes/${DEFAULT_SCAD_LAYOUT}`,
		getAssetFile("_layouts", DEFAULT_SCAD_LAYOUT),
		{},
	);
}

export function addScadCollectionVirtualTemplate(
	eleventyConfig: EleventyConfig,
) {
	const listingLayout = "scad.models.html";
	eleventyConfig.addTemplate(
		`_includes/${listingLayout}`,
		`<html><body>{{ content }}</body></html>`,
		{},
	);
	eleventyConfig.addTemplate(
		`index.njk`,
		`<ul>
        {% for item in collections.scad %}
          <li><a href="/{{ item.data.title }}">{{ item.data.title }}</a></li>
        {% endfor %}
    </ul>`,
		{
			layout: listingLayout,
		},
	);
}
