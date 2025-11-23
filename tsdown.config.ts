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
				verbose: true,
				targets: [
					{
						src: "src/assets/**/*",
						dest: "dist/assets/",
					},
				],
			}),
		],
		hooks: {
			"build:prepare": () => {
				console.error("-=-=-=-=-=-=-=-=-=- PREPARE -=-=-=-=-=-=-=-=-=-");
			},
			"build:before": () => {
				console.error("-=-=-=-=-=-=-=-=-=- BEFORE -=-=-=-=-=-=-=-=-=-");
			},
			"build:done": () => {
				console.error("-=-=-=-=-=-=-=-=-=- DONE -=-=-=-=-=-=-=-=-=-");
			},
		},
	},
]);
