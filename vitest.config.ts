import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		maxWorkers: 1,
		setupFiles: ["./test/_setup/expect.ts"],
		expect: {
			requireAssertions: true,
		},
	},
});
