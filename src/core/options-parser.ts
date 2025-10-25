import { red } from "yoctocolors";
import z from "zod";
import OptionsSchema from "./options";
import type { MaybePluginOptions, PluginOptions } from "../types";

/**
 * Eleventy Plugin for OpenSCAD
 */
export default function (cfg: { logger: (message: string) => void }) {
	return (options: MaybePluginOptions): PluginOptions => {
		const log = cfg.logger ?? ((m) => console.error(m));
		const parsedOptions = OptionsSchema.safeParse(options);

		if (parsedOptions.error) {
			log(red("Options Error"));
			log(z.prettifyError(parsedOptions.error));
			process.exit();
		}

		return parsedOptions.data;
	};
}
