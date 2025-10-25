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
				targets: [
					{ src: "src/_layouts", dest: "dist" },
					{ src: "src/_includes", dest: "dist" },
				],
			}),
		],
	},
]);
