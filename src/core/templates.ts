import { Debug, getAssetFileContent } from "../lib";
import { DEFAULT_COLLECTION_LAYOUT, DEFAULT_SCAD_LAYOUT } from "./const";
import type { EleventyConfig, ModelViewerTheme } from "../types";

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
	pageTheme: ModelViewerTheme,
) {
	log(`(virtual) adding "%o"`, DEFAULT_COLLECTION_LAYOUT);
	eleventyConfig.addTemplate(
		`_includes/${DEFAULT_COLLECTION_LAYOUT}`,
		getAssetFileContent(DEFAULT_COLLECTION_LAYOUT),
		{},
	);

	const DEFAULT_COLLECTION_TEMPLATE = "index.njk";
	const tableHTML = `<!-- added by addScadCollectionVirtualTemplate -->
		<table>
			<thead>
				<tr>
					<th>Title</th>
					<th>Location</th>
				</tr>
			</thead>
			<tbody>
				{% for item in collections.scad %}
				<tr>
					<td>
						<a href="{{ item.data.page.url | url }}">{{ item.data.title }}</a>
					</td>
					<td>{{ item.data.page.url }}</td>
				</tr>
				{% endfor %}
			</tbody>
		</table>`;
	eleventyConfig.addTemplate(DEFAULT_COLLECTION_TEMPLATE, tableHTML, {
		layout: DEFAULT_COLLECTION_LAYOUT,
		theme: pageTheme,
	});
	log(`(virtual) added "%o"`, DEFAULT_COLLECTION_TEMPLATE);
}
