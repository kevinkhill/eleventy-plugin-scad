import { env } from "node:process";
import Debug from "./debug";

const debug = Debug.extend("env");

export function getEnv<T>(envvar: string): T | undefined {
	const val = env[envvar];
	debug("%o = %o", envvar, val);
	if (typeof val === "string" && val.length > 0) return val as T;
	return undefined;
}
