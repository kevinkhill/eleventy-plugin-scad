import path from "node:path";
import { beforeAll, expect, suite, test } from "vitest";
import {
	cleanOutputDir,
	createTestInstance,
	TEST_INPUT_PAGES,
	TEST_SITE_OUTPUT,
} from "./_setup/eleventy";
import type Eleventy from "@11ty/eleventy";
import type { LaunchPath } from "../src";

let eleventy: Eleventy;

beforeAll(async () => {
	eleventy = createTestInstance({
		launchPath: "nightly",
		// resolveLaunchPath: false,
		silent: true,
	});
});

const CASES: [LaunchPath][] = [["nightly"], ["docker:trixie"]];

suite.each(CASES)("launchPath: %s", () => {
	beforeAll(async () => {
		await cleanOutputDir();
		await eleventy.write();
	});

	test(`"/index.html" exists`, () => {
		const index = path.join(TEST_SITE_OUTPUT, "index.html");
		expect(index).toExist();
	});

	for (const name of TEST_INPUT_PAGES) {
		test(`"/${name}/index.html" exists`, () => {
			const index = path.join(TEST_SITE_OUTPUT, name, "index.html");
			expect(index).toExist();
		});

		test(`"/${name}/${name}.stl" exists`, () => {
			const stl = path.join(TEST_SITE_OUTPUT, name, `${name}.stl`);
			expect(stl).toExist();
		});
	}
});
