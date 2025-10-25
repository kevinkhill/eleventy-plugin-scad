import { DEFAULT_THREE_JS_VERSION, DOT_STL } from "../lib/const";
import type { EleventyConfig } from "../types";

/**
 * Helper Shortcodes for generating pages from scad templates
 */
export default function (eleventyConfig: EleventyConfig) {
	/**
	 * Shortcode to produce a script block with the the absolute path to the model stl
	 *
	 * {% stl_url "TACO" %} would produce /TACO/TACO.stl
	 *  so do this 👇🏻
	 * {% stl_url page.fileSlug %}
	 */
	eleventyConfig.addShortcode("stl_url", (fileSlug: string) => {
		const stlPath = `${fileSlug}/${fileSlug}${DOT_STL}`;
		return `new URL("${stlPath}",window.location.origin)`;
	});

	/**
	 * Shortcode to produce the importmaps for three.js
	 *
	 * {% threejs_importmap %}
	 * {% threejs_importmap "1.2.3" %}
	 */
	eleventyConfig.addShortcode("threejs_importmap", (arg1: string) => {
		const v = arg1.length > 0 ? arg1 : DEFAULT_THREE_JS_VERSION;
		return `\
		<script type="importmap">
			{
				"imports": {
					"three": "https://cdn.jsdelivr.net/npm/three@${v}/build/three.module.js",
					"three/addons/": "https://cdn.jsdelivr.net/npm/three@${v}/examples/jsm/"
				}
			}
		</script>\
		`;
	});
}
