import copy from "rollup-plugin-copy";
import { defineConfig } from "tsdown";

export default defineConfig([
	{
		noExternal: ["11ty.ts"],
		entry: ["./src/index.ts"],
		platform: "node",
		dts: true,
		plugins: [
			copy({
				targets: [{ src: "src/assets/**/*", dest: "dist/assets" }],
				verbose: true,
			}),
		],
	},
]);
