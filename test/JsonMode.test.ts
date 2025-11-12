import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
	cleanOutputDir,
	createTestInstance,
	TEST_INPUT_PAGES,
} from "./_setup/eleventy";
import type Eleventy from "@11ty/eleventy";

let eleventy: Eleventy;

beforeAll(async () => {
	eleventy = createTestInstance({
		launchPath: "docker",
		resolveLaunchPath: false,
		noSTL: true,
		silent: true,
	});
	await cleanOutputDir();
});

const fixture = {
	pages: [] as EleventyPageJSON[],
};

describe.each(TEST_INPUT_PAGES)("%s.scad", (name) => {
	let page: EleventyPageJSON | undefined;

	beforeAll(async () => {
		fixture.pages = [];
		const generated = await eleventy.toJSON();
		fixture.pages.push(...generated);
	});

	beforeEach(() => {
		page = fixture.pages.find((p) => p.url.includes(name));
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
		page = fixture.pages.find((p) => p.url === "/");
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
