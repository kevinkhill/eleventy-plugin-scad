import path from "node:path";

export const TEST_SETUP_DIR = import.meta.dirname;
export const TEST_ROOT_DIR = path.resolve(TEST_SETUP_DIR, "..");

export const ELEVENTY_TEST_ROOT = path.join(TEST_ROOT_DIR, "_11ty");
export const ELEVENTY_TEST_INPUT = path.join(ELEVENTY_TEST_ROOT, "input");
export const ELEVENTY_TEST_OUTPUT = path.join(ELEVENTY_TEST_ROOT, "output");
