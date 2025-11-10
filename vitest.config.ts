import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		maxWorkers: 1,
		setupFiles: ["./test/_setup/expect.ts"],
		coverage: {
			enabled: false,
		},
		expect: {
			requireAssertions: true,
		},
	},
});
