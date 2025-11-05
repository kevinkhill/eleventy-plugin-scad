import path from "node:path";
import { rimraf } from "rimraf";
import { beforeAll, describe, expect, it } from "vitest";
import {
	createTestInstance,
	TEST_SCAD_PAGES,
	TEST_SITE_OUTPUT,
} from "./_setup/eleventy";

const eleventy = createTestInstance({
	launchPath: "nightly",
});

beforeAll(async () => {
	await rimraf(path.join(TEST_SITE_OUTPUT, "*"), { glob: true });
	await eleventy.write();
});

describe("(virtual) index.html", () => {
	it(`generated "index.html"`, () => {
		const index = path.join(TEST_SITE_OUTPUT, "index.html");
		expect(index).toExist();
	});
});

describe.for(TEST_SCAD_PAGES)("%s.scad", ([name]) => {
	const generatedDir = path.join(TEST_SITE_OUTPUT, name);

	it(`generated "${name}/index.html"`, () => {
		const index = path.join(generatedDir, "index.html");
		expect(index).toExist();
	});

	it(`generated "${name}/${name}.stl"`, () => {
		const stl = path.join(generatedDir, `${name}.stl`);
		expect(stl).toExist();
	});
});
