import he from "he";
import type { EleventyConfig } from "../types";

export function addScadMarkdownHighlighter(eleventyConfig: EleventyConfig) {
	const { markdownHighlighter } = eleventyConfig;

	eleventyConfig.addMarkdownHighlighter((content: string, language: string) => {
		if (language === "mermaid") {
			return `<pre class="openscad">${he.encode(content)}</pre>`;
		}
		if (markdownHighlighter) {
			return markdownHighlighter(content, language);
		}
		return `<pre class="${language}">${content}</pre>`;
	});
}
