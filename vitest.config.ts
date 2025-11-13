import { defineConfig } from "vitest/config";

const TEN_SECONDS = 10 * 1000;

export default defineConfig({
	test: {
		maxWorkers: 1,
		testTimeout: TEN_SECONDS,
		setupFiles: ["./test/_setup/expect.ts"],
		coverage: {
			enabled: false,
		},
		expect: {
			requireAssertions: true,
		},
	},
});
