import Debug from "../lib/debug";
import { THREE_JS_VERSION } from "./const";
import type { EleventyConfig, ModelViewerTheme } from "../types";

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
	 * Link tag with url for themes created by w3.org
	 *
	 * @example {% w3_theme_css %}
	 * @link https://www.w3.org/StyleSheets/Core/preview
	 */
	registerShortcode("w3_theme_css", () => {
		const url = `https://www.w3.org/StyleSheets/Core/${opts.defaultTheme}`;
		return `<link rel="stylesheet" href="${url}">`;
	});

	/**
	 * Import Maps for three.js
	 *
	 * @example {% threejs_importmap %}
	 */
	registerShortcode("threejs_importmap", () => {
		const v = THREE_JS_VERSION;
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
