import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { parse } from "toml";
import { Debug } from "../lib";

const regex = /\/\*---\s*([\s\S]*?)\s*---\*\//;

const debug = Debug.extend("frontmatter");

export function parseTomlFrontMatter(scadContent: string) {
	const match = scadContent.match(regex);

	if (match) {
		const tomlContent = match[1];
		debug("found: %O", tomlContent);

		const options = parse(tomlContent);
		debug("parsed: %O", options);

		return {
			content: options,
			error: "",
		};
	}

	return {
		content: null,
		error: "no frontmatter found",
	};
}

export function parseScadFileFrontMatter(input: string) {
	const scadContent = readFileSync(input, "utf8");
	return parseTomlFrontMatter(scadContent);
}

export async function parseScadFileFrontMatterAsync(input: string) {
	const scadContent = await readFile(input, "utf8");
	return parseTomlFrontMatter(scadContent);
}
