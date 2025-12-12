import { Debug, getAssetFileContent } from "../lib";
import { SCAD_COLLECTION_LAYOUT, SCAD_VIEWER_LAYOUT } from "./const";
import type { EleventyConfig, ParsedPluginOptions } from "../types";

const debug = Debug.extend("templates");

/**
 * Load nunjucks templates from disk and register as virtual templates
 */
export function addScadPluginTemplates(
	eleventyConfig: EleventyConfig,
	{
		theme,
		collectionPage,
		collectionPageTitle,
	}: Pick<
		ParsedPluginOptions,
		"theme" | "collectionPage" | "collectionPageTitle"
	>,
) {
	const addVirtualTemplate = (
		templatePath: string,
		assetFilename: string,
		data: Record<string, unknown> = {},
	) => {
		const html = getAssetFileContent(assetFilename);
		eleventyConfig.addTemplate(templatePath, html, data);
		debug(`(virtual) added %o`, templatePath);
	};

	eleventyConfig.addPassthroughCopy("img");

	// Default renderer for `.scad` files once turned into HTML
	addVirtualTemplate(`_includes/${SCAD_VIEWER_LAYOUT}`, SCAD_VIEWER_LAYOUT, {
		rendererJS: getAssetFileContent("scad.renderer.js"),
		// rendererJS: getAssetFileContent("scad.bloomRenderer.js"),
	});

	if (collectionPage) {
		// Template that lists all the collected `.scad` files
		addVirtualTemplate("index.njk", SCAD_COLLECTION_LAYOUT, {
			theme,
			title: collectionPageTitle,
		});
	}
}
