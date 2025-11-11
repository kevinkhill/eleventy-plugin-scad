import { existsSync } from "node:fs";
import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import {
	createTestInstance,
	TEST_SCAD_PAGES,
	TEST_SITE_OUTPUT,
} from "./_setup/eleventy";
import type Eleventy from "@11ty/eleventy";

let eleventy: Eleventy;

beforeAll(async () => {
	eleventy = createTestInstance({
		launchPath: "docker",
		resolveLaunchPath: false,
		silent: true,
	});

	if (existsSync(TEST_SITE_OUTPUT)) {
		const files = await readdir(TEST_SITE_OUTPUT);
		for (const file of files) {
			await rm(path.join(TEST_SITE_OUTPUT, file), {
				recursive: true,
				force: true,
			});
		}
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
