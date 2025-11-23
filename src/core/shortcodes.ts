import { THREE_JS_VERSION } from "../config";
import { Debug, useNonEmptyOrDefault } from "../lib";
import type { EleventyConfig, ModelViewerTheme } from "../types";

const debug = Debug.extend("shortcodes");

/**
 * Helper Shortcodes for generating pages from scad templates
 */
export function addShortcodes(
	eleventyConfig: EleventyConfig,
	opts: { theme: ModelViewerTheme },
) {
	debug(`opts %O`, opts);

	/**
	 * Link and script tags for themes created by w3.org
	 *
	 * @example {% w3_theme %}
	 * @link https://www.w3.org/StyleSheets/Core/preview
	 */
	eleventyConfig.addShortcode("w3_theme", (userTheme: ModelViewerTheme) => {
		const theme = useNonEmptyOrDefault(userTheme, opts.theme);
		const url = `https://www.w3.org/StyleSheets/Core/${theme}`;
		const w3cThemeCssLinkTag = `<link id="__eleventy_scad_theme" rel="stylesheet" href="${url}">`;
		const themeOverrideScriptTag = `<script>
			document.addEventListener('DOMContentLoaded', function (evt) {
  				const searchParams = new URLSearchParams(window.location.search);
				if (searchParams.has("theme")) {
					const themeOverride = searchParams.get("theme");
					console.log("has theme override", { themeOverride });
					const link = document.getElementById("__eleventy_scad_theme");
					link.href = link.href.replace("${theme}", themeOverride);
				}
			}, false);
    	</script>`;
		return [w3cThemeCssLinkTag, themeOverrideScriptTag].join("\n");
	});
	debug(`added "%s"`, "w3_theme");

	/**
	 * Import Maps for three.js
	 *
	 * @example {% threejs_importmap %}
	 */
	eleventyConfig.addShortcode("threejs_importmap", () => {
		const cdn_base = `https://cdn.jsdelivr.net/npm/three@${THREE_JS_VERSION}`;
		const importmap = {
			imports: {
				three: `${cdn_base}/build/three.module.js`,
				"three/addons/": `${cdn_base}/examples/jsm/`,
			},
		};
		return `<script type="importmap">${JSON.stringify(importmap)}</script>`;
	});
	debug(`added "%s"`, "threejs_importmap");
}
