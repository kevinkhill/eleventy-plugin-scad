import { debug as $debug } from "../lib";
import { DOT_STL } from "./const";
import type { EleventyConfig, PluginOptions } from "../types";

export const DEFAULT_THREE_JS_VERSION = "0.180.0";

export const DEFAULT_LIL_GUI_VERSION = "0.21";

const debug = $debug.extend("shortcodes");

/**
 * Helper Shortcodes for generating pages from scad templates
 */
export function addShortcodes(
	eleventyConfig: EleventyConfig,
	{ theme }: { theme: PluginOptions["theme"] },
) {
	const registerShortcode: (typeof eleventyConfig)["addShortcode"] = (
		shortcodeName,
		filter,
	) => {
		eleventyConfig.addShortcode(shortcodeName, filter);
		debug(`added "%s"`, shortcodeName);
	};

	/**
	 * Shortcode to produce a script block with the the absolute path to the model stl
	 *
	 * {% stl_url "TACO" %} would produce /TACO/TACO.stl
	 *  so do this 👇🏻
	 * {% stl_url page.fileSlug %}
	 */
	registerShortcode("stl_url", (fileSlug: string) => {
		const stlPath = `${fileSlug}/${fileSlug}${DOT_STL}`;
		return `new URL("${stlPath}", window.location.origin)`;
	});

	/**
	 * Shortcode to produce a style block with themes created by w3.org
	 *
	 * Choices: Chocolate, Midnight, Modernist, Oldstyle, Steely, Swiss, Traditional, and Ultramarine
	 *
	 * {% w3_theme_css %} 👈🏻 Defaults to "__DEFAULT_THEME__" if no theme defined in the config
	 * {% w3_theme_css "Chocolate" %}
	 */
	registerShortcode("w3_theme_css", () => {
		return `<link rel="stylesheet" href="https://www.w3.org/StyleSheets/Core/${theme}" type="text/css">`;
	});

	/**
	 * Shortcode to produce the importmaps for three.js
	 *
	 * {% threejs_importmap %}
	 * {% threejs_importmap "1.2.3" %}
	 */
	registerShortcode("threejs_importmap", (version: string) => {
		const v = version.length > 0 ? version : DEFAULT_THREE_JS_VERSION;
		return `\
		<script type="importmap">
			{
				"imports": {
					"three": "https://cdn.jsdelivr.net/npm/three@${v}/build/three.module.js",
					"three/addons/": "https://cdn.jsdelivr.net/npm/three@${v}/examples/jsm/"
				}
			}
		</script>`;
	});
}

// <script type="module">
//   import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.39.0/+esm';

//   const editor = document.getElementsByClassName('monaco');
//   monaco
//     .editor
//     .create(editor[0], {
//       value: editor[0].innerHTML,
//       language: 'javascript',
//       theme: 'vs-dark'
//     });
// </script>
