import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import {
	createTestInstance,
	TEST_SCAD_PAGES,
	TEST_SITE_OUTPUT,
} from "./_setup/eleventy";

const eleventy = createTestInstance({
	launchPath: "nightly",
	silent: true,
});

beforeAll(async () => {
	if (existsSync(TEST_SITE_OUTPUT)) {
		await fs.rm(TEST_SITE_OUTPUT, { recursive: true, force: true });
	}
	await eleventy.write();
});

describe("(virtual) index.html", () => {
	it(`generated "index.html"`, () => {
		const index = path.join(TEST_SITE_OUTPUT, "index.html");
		expect(index).toExist();
	});
});

describe.for(TEST_SCAD_PAGES)("%s.scad", ([name]) => {
	const modelDir = path.join(TEST_SITE_OUTPUT, name);

	it(`generated "${name}/index.html"`, () => {
		const index = path.join(modelDir, "index.html");
		expect(index).toExist();
	});

	it(`generated "${name}/${name}.stl"`, () => {
		const stl = path.join(modelDir, `${name}.stl`);
		expect(stl).toExist();
	});
});
