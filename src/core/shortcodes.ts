import Debug from "../lib/debug";
import { DOT_STL } from "./const";
import type { EleventyConfig, ModelViewerTheme } from "../types";

export const DEFAULT_THREE_JS_VERSION = "0.180.0";

export const DEFAULT_LIL_GUI_VERSION = "0.21";

const debug = Debug.extend("shortcodes");

/**
 * Helper Shortcodes for generating pages from scad templates
 */
export function addShortcodes(
	eleventyConfig: EleventyConfig,
	opts: { defaultTheme: ModelViewerTheme },
) {
	const registerShortcode: EleventyConfig["addShortcode"] = (name, filter) => {
		eleventyConfig.addShortcode(name, filter);
		debug(`added "%s"`, name);
	};

	/**
	 * Shortcode to produce a style block with themes created by w3.org
	 *
	 * Choices: "./themes.ts"
	 * {% w3_theme_css "Chocolate" %}
	 */
	registerShortcode("w3_theme_css", (theme: string) => {
		const pluginTheme = theme?.trim() || opts.defaultTheme;
		return `<link rel="stylesheet" href="https://www.w3.org/StyleSheets/Core/${pluginTheme}" type="text/css">`;
	});

	/**
	 * Shortcode to produce the importmaps for three.js
	 *
	 * {% threejs_importmap %}
	 * {% threejs_importmap "1.2.3" %}
	 */
	registerShortcode("threejs_importmap", (version?: string) => {
		const v = version?.trim() || DEFAULT_THREE_JS_VERSION;

		const importmap = {
			imports: {
				three: `https://cdn.jsdelivr.net/npm/three@${v}/build/three.module.js`,
				"three/addons/": `https://cdn.jsdelivr.net/npm/three@${v}/examples/jsm/`,
			},
		};

		return `<script type="importmap">${JSON.stringify(importmap)}</script>`;
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
