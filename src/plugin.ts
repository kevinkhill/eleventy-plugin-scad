import { blue, cyan, gray, green, red, reset } from "yoctocolors";
import { prettifyError } from "zod";
import { addScadPluginTemplates, addShortcodes, parseOptions } from "./core";
import { PLUGIN_NAME } from "./core/const";
import { addScadExtensionHandler } from "./core/extension";
import { createScadLogger, createSilentLogger } from "./lib";
import type { EleventyConfig, PluginOptionsInput } from "./types";

/**
 * Eleventy Plugin for OpenSCAD
 *
 * @param {EleventyConfig} eleventyConfig
 * @param {PluginOptionsInput} options
 */
export function EleventyPluginOpenSCAD(
	eleventyConfig: EleventyConfig,
	options: PluginOptionsInput,
) {
	try {
		if (!("addTemplate" in eleventyConfig)) {
			throw new Error(
				`Virtual Templates are required for this plugin, please use Eleventy v3.0 or newer.`,
			);
		}
	} catch (e) {
		console.log(
			`[${PLUGIN_NAME}] WARN Eleventy plugin compatibility: ${(e as Error).message}`,
		);
	}

	const log = createScadLogger(eleventyConfig);
	const parsedOptions = parseOptions(options);

	if (parsedOptions.error) {
		const message = prettifyError(parsedOptions.error);
		log(red(message));
		throw new Error(message);
	}

	const {
		theme,
		noSTL,
		silent,
		verbose,
		launchPath,
		collectionPage,
		resolveLaunchPath,
	} = parsedOptions.data;

	const _log = createSilentLogger(log, silent);

	_log(`${gray("Theme:")} ${reset(theme)}`);
	_log(
		`${gray("Spawn:")} ${(launchPath === "docker" ? cyan : blue)(String(launchPath))}`,
	);
	_log(
		[
			gray(" Opts:"),
			silent ? green("+silent") : "",
			verbose ? green("+verbose") : "",
			noSTL ? red("-noSTL") : "",
			!resolveLaunchPath ? red("-resolveLaunchPath") : "",
			!collectionPage ? red("-collectionPage") : "",
		]
			.join(" ")
			.replaceAll(/\s+/g, " "),
	);

	addShortcodes(eleventyConfig, { theme });
	addScadPluginTemplates(eleventyConfig, parsedOptions.data);
	addScadExtensionHandler(eleventyConfig, parsedOptions.data);
	// addScad2PngTransformer(eleventyConfig, launchPath);
}
