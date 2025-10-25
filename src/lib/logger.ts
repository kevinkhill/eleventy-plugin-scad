import { yellow } from "yoctocolors";
import type { EleventyConfig } from "11ty.ts";

export function getLogger(eleventyConfig: EleventyConfig) {
	return eleventyConfig.logger as EleventyLogger;
}

export function createScadLogger(eleventyConfig: EleventyConfig) {
	return (message: string) =>
		getLogger(eleventyConfig).logWithOptions({
			message,
			color: "yellow",
			type: "log",
			prefix: `[11ty/${yellow("scad")}]`,
		});
}

type LogOptions = {
	message: string;
	prefix?: string;
	type?: "error" | "log" | "warn" | "info";
	color?: string;
	force?: boolean;
};

interface EleventyLogger {
	/**
	 * Whether verbose logging is enabled.
	 */
	get isVerbose(): boolean;
	set isVerbose(value: boolean);

	/**
	 * Whether chalk color output is enabled.
	 */
	get isChalkEnabled(): boolean;
	set isChalkEnabled(value: boolean);

	/**
	 * Whether logging output is enabled based on config/env.
	 */
	isLoggingEnabled(): boolean;

	/**
	 * Override the internal logger. Use `false` to disable output.
	 */
	overrideLogger(logger: Partial<Console> | false): void;

	/**
	 * Get the current logger. Falls back to console.
	 */
	get logger(): Partial<Console>;

	/**
	 * Log a message (default level).
	 */
	log(msg: string): void;

	/**
	 * Log a message using structured options.
	 */
	logWithOptions(options: LogOptions): void;

	/**
	 * Force output regardless of verbosity/debug settings.
	 */
	forceLog(msg: string): void;

	/**
	 * Log an info-level message (blue).
	 */
	info(msg: string): void;

	/**
	 * Log a warning-level message (yellow).
	 */
	warn(msg: string): void;

	/**
	 * Log an error-level message (red).
	 */
	error(msg: string): void;

	/**
	 * Internal method to emit a message with formatting and coloring.
	 */
	message(
		message: string,
		type?: LogOptions["type"],
		chalkColor?: string,
		forceToConsole?: boolean,
		prefix?: string,
	): void;
}
