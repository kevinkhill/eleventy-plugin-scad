import { join } from "node:path";
import { defineConfig } from "vitest/config";

const THIRTY_SECONDS = 30_000;

export default defineConfig({
	test: {
		maxWorkers: 1,
		testTimeout: THIRTY_SECONDS,
		setupFiles: [join(import.meta.dirname, "test/_setup/expect.ts")],
		coverage: { enabled: false },
		expect: { requireAssertions: true },
	},
});
