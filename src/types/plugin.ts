import type z from "zod";
import type PluginOptionsSchema from "../options";

export type PluginOptions = z.infer<typeof PluginOptionsSchema>;

export interface ScadPageData {
  title: string;
  inFile: string;
  outFile: string;
  outFileUrl: string;
  tags: string[];
}
