import { env } from "node:process";
import Debug from "./debug";

const debug = Debug.extend("env");

const cache = new Map<string, string | undefined>();

export function getEnv<T extends string>(envvar: string): T | undefined {
	if (cache.has(envvar)) return cache.get(envvar) as T | undefined;

	const val = env[envvar];
	debug("%s=%s", envvar, val);

	const result =
		typeof val === "string" && val.length > 0 ? (val as T) : undefined;
	cache.set(envvar, result);
	return result;
}
