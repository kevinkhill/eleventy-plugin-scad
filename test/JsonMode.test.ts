import { homedir } from "node:os";
import { join } from "node:path";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { SCAD_BIN } from "../src";
import { createEleventyScadClient } from "./_setup/11ty-scad";
import type { EleventyPageJSON } from "./_setup/types";

const escad = createEleventyScadClient({
	launchPath: join(homedir(), SCAD_BIN.MACOS),
	silent: true,
});

const pages: EleventyPageJSON[] = [];

beforeAll(async () => {
	const generated = (await escad.toJSON()) as EleventyPageJSON[];
	pages.push(...generated);
});

describe.for([["cube"], ["sphere"], ["cylinder"]])("%s.scad", ([name]) => {
	let page: EleventyPageJSON;

	beforeEach(() => {
		page = pages.find((p) => p.url.includes(name)) as EleventyPageJSON;
		console.log(page);
	});

	it("has the correct URL", () => {
		expect(page?.url).toBe(`/${name}/`);
	});

	it("has the correct input path", () => {
		expect(page?.inputPath).toEndWithString(`input/${name}.scad`);
	});

	it("has the correct output path", () => {
		expect(page.outputPath).toEndWithString(`output/${name}/index.html`);
	});

	it("has valid HTML content", () => {
		expect(page?.content).toStartWithString("<!DOCTYPE html>");
		expect(page?.content).toEndWithString("</html>\n");
	});
});

describe("(virtual) index.html", () => {
	let page: EleventyPageJSON;

	beforeAll(() => {
		const _page = pages.find((p) => p.url === "/");
		if (!_page) {
			throw new Error(
				"This should never throw unless the page didn't generate",
			);
		}
		page = _page;
	});

	it("has the correct URL", () => {
		expect(page.url).toBe("/");
	});

	it("has valid HTML content", () => {
		expect(page?.content).toStartWithString("<!DOCTYPE html>");
	});

	it("has the correct input path", () => {
		expect(page.inputPath).toEndWithString(`input/index.njk`);
	});

	it("generated the correct output HTML file", () => {
		expect(page.outputPath).toEndWithString(`output/index.html`);
	});
});
