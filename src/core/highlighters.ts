import he from "he";
import type { EleventyConfig } from "../lib/types";

export function addScadMarkdownHighlighter(eleventyConfig: EleventyConfig) {
	eleventyConfig.addMarkdownHighlighter((content: string, language: string) => {
		if (language === "scad") {
			return `<pre class="openscad">${he.encode(content)}</pre>`;
		}
		return eleventyConfig.markdownHighlighter(content, language);
	});
}
