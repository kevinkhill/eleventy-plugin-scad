import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createTestInstance, TEST_SCAD_PAGES } from "./_setup/eleventy";

const eleventy = createTestInstance({
	launchPath: "nightly",
	silent: true,
});

const pages: EleventyPageJSON[] = [];

beforeAll(async () => {
	const generated = await eleventy.toJSON();
	pages.push(...generated);
});

describe.for(TEST_SCAD_PAGES)("%s.scad", ([name]) => {
	let page: EleventyPageJSON | undefined;

	beforeEach(() => {
		page = pages.find((p) => p.url.includes(name));
	});

	it("has the correct URL", () => {
		expect(page?.url).toBe(`/${name}/`);
	});

	it("has the correct input path", () => {
		expect(page?.inputPath).toEndWithString(`input/${name}.scad`);
	});

	it("has the correct output path", () => {
		expect(page?.outputPath).toEndWithString(`output/${name}/index.html`);
	});

	it("has valid HTML content", () => {
		const content = page?.content?.toLowerCase();
		expect(content).toStartWithString("<!doctype html>");
		expect(content).toEndWithString("</html>\n");
	});
});

describe("(virtual) index.html", () => {
	let page: EleventyPageJSON | undefined;

	beforeAll(() => {
		page = pages.find((p) => p.url === "/");
	});

	it("has the correct URL", () => {
		expect(page?.url).toBe("/");
	});

	it("has valid HTML content", () => {
		const content = page?.content?.toLowerCase();
		expect(content).toStartWithString("<!doctype html>");
	});

	it("has the correct input path", () => {
		expect(page?.inputPath).toEndWithString(`input/index.njk`);
	});

	it("generated the correct output HTML file", () => {
		expect(page?.outputPath).toEndWithString(`output/index.html`);
	});
});

type EleventyPageJSON = Awaited<ReturnType<typeof eleventy.toJSON>>[number];
