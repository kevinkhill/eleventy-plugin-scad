import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { EleventySCAD } from "./EleventySCAD";
import type { EleventyPageJSON } from "./_setup/types";

describe("JSON Mode", () => {
	const pages: EleventyPageJSON[] = [];

	beforeAll(async () => {
		const generated = (await EleventySCAD.toJSON()) as EleventyPageJSON[];
		pages.push(...generated);
	});

	it("Generates HTML from '.scad' template", () => {
		expect(pages).toHaveLength(1);
	});

	describe("cube.scad", () => {
		let page: EleventyPageJSON;

		beforeEach(() => {
			page = pages[0];
		});

		it("has the correct URL", () => {
			expect(page.url).toBe("/cube/");
		});

		it("has valid HTML content", () => {
			expect(page.content).toMatchStartOfString("<!DOCTYPE html>");
		});

		it("has the correct input path", () => {
			expect(page.inputPath).toMatchEndOfString("input/cube.scad");
		});

		it("has the correct output path", () => {
			expect(page.outputPath).toMatchEndOfString("output/cube/index.html");
		});

		it("has the correct raw input", () => {
			expect(page.rawInput).toBe("cube(10);\n");
		});
	});
});
