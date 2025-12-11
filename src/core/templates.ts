import { Debug, getAssetFileContent } from "../lib";
import { SCAD_COLLECTION_LAYOUT, SCAD_EXT, SCAD_VIEWER_LAYOUT } from "./const";
import type { EleventyConfig, ModelViewerTheme } from "../types";

const debug = Debug.extend("templates");

export function addScadPluginTemplates(
	eleventyConfig: EleventyConfig,
	opts: { theme: ModelViewerTheme; collectionPage: boolean },
) {
	/**
	 * Register `.scad` files as virtual template files and
	 * define they are to be compiled into html & stl files.
	 */
	eleventyConfig.addTemplateFormats(SCAD_EXT);

	// Common themeable pages
	addTemplateFromAsset(eleventyConfig, "scad.base.njk");

	// Default renderer for `.scad` files once turned into HTML
	addTemplateFromAsset(eleventyConfig, SCAD_VIEWER_LAYOUT);

	if (opts.collectionPage) {
		// Add template that lists all the collected `.scad` files
		addTemplateFromAsset(eleventyConfig, SCAD_COLLECTION_LAYOUT);
		// Content template with listing
		addScadCollectionVirtualTemplate(eleventyConfig, { theme: opts.theme });
	}
}

/**
 * Helper funcion to register templates from internal library assets
 */
export function addTemplateFromAsset(
	eleventyConfig: EleventyConfig,
	filename: string,
	data?: Record<string, unknown>,
) {
	const html = getAssetFileContent(filename);
	eleventyConfig.addTemplate(`_includes/${filename}`, html, data ?? {});
	debug(`(virtual) added %o`, filename);
}

function addScadCollectionVirtualTemplate(
	eleventyConfig: EleventyConfig,
	{ theme, filename }: { theme: ModelViewerTheme; filename?: string },
) {
	const indexFile = filename ?? "index.njk";
	const tableHTML = `
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
	eleventyConfig.addTemplate(indexFile, tableHTML, {
		layout: SCAD_COLLECTION_LAYOUT,
		theme,
		I_AM: "BATMAN",
	});
	debug(`(virtual) added %o`, indexFile);
}
