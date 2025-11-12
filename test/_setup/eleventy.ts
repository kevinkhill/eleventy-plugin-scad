import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import Eleventy from "@11ty/eleventy";
import { EleventyPluginOpenSCAD } from "../../src";
import type { EleventyConfig, PluginOptionsInput } from "../../src";

const TEST_DIR = path.resolve(import.meta.dirname, "..");

export const TEST_SITE_ROOT = path.join(TEST_DIR, "_11ty");
export const TEST_SITE_INPUT = path.join(TEST_SITE_ROOT, "input");
export const TEST_SITE_OUTPUT = path.join(TEST_SITE_ROOT, "output");

export const TEST_INPUT_PAGES = ["cube", "sphere", "cylinder"] as const;

export function createTestInstance(options: PluginOptionsInput): Eleventy {
	return new Eleventy(TEST_SITE_INPUT, TEST_SITE_OUTPUT, {
		config: (eleventyConfig: EleventyConfig) => {
			eleventyConfig.addPlugin(EleventyPluginOpenSCAD, options);
		},
	});
}

/**
 * Delete all test files in output dir
 */
export async function cleanOutputDir() {
	const files = await readdir(TEST_SITE_OUTPUT);
	for (const file of files) {
		await rm(path.join(TEST_SITE_OUTPUT, file), {
			recursive: true,
			force: true,
		});
	}
}
