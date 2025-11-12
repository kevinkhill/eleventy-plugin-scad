import { DEFAULT_PLUGIN_THEME, THREE_JS_VERSION } from "../config";
import { Debug, useNonEmptyOrDefault } from "../lib";
import type { EleventyConfig, ModelViewerTheme } from "../types";

const debug = Debug.extend("shortcodes");

/**
 * Helper Shortcodes for generating pages from scad templates
 */
export function addShortcodes(eleventyConfig: EleventyConfig) {
	const registerShortcode = (name: string, filter: Filter) => {
		eleventyConfig.addShortcode(name, filter);
		debug(`added "%s"`, name);
	};
	debug("defaultTheme: %o", DEFAULT_PLUGIN_THEME);

	/**
	 * Link tag with url for themes created by w3.org
	 *
	 * @example {% w3_theme_css %}
	 * @link https://www.w3.org/StyleSheets/Core/preview
	 */
	registerShortcode("w3_theme_css", (userTheme: ModelViewerTheme) => {
		const $theme = useNonEmptyOrDefault(userTheme, DEFAULT_PLUGIN_THEME);
		const url = `https://www.w3.org/StyleSheets/Core/${$theme}`;
		return `<link rel="stylesheet" href="${url}">`;
	});

	/**
	 * Import Maps for three.js
	 *
	 * @example {% threejs_importmap %}
	 */
	registerShortcode("threejs_importmap", () => {
		const cdn_base = `https://cdn.jsdelivr.net/npm/three@${THREE_JS_VERSION}`;
		const importmap = {
			imports: {
				three: `${cdn_base}/build/three.module.js`,
				"three/addons/": `${cdn_base}/examples/jsm/`,
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
type Filter = Parameters<EleventyConfig["addShortcode"]>[1];
