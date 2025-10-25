import { defineConfig } from "tsdown";

export default defineConfig([
  {
    noExternal: ["11ty.ts"],
    entry: ["./src/index.ts"],
    platform: "node",
    dts: true,
  },
]);
