import replace from "@rollup/plugin-replace";
import copy from "rollup-plugin-copy";
import { defineConfig } from "tsdown";
import type { StlViewerThemes } from "./src/lib/types";

const DEFAULT_THEME: StlViewerThemes = "Midnight";

export default defineConfig([
	{
		noExternal: ["11ty.ts"],
		entry: ["./src/index.ts"],
		platform: "node",
		dts: true,
		plugins: [
			replace({
				preventAssignment: true,
				values: {
					__DEFAULT_THEME__: DEFAULT_THEME,
				},
			}),
			copy({
				targets: [
					{
						src: "src/assets/**/*",
						dest: "dist/assets/",
					},
				],
				verbose: true,
			}),
		],
	},
]);
