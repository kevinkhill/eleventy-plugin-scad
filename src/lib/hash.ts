import { createHash } from "node:crypto";
import Debug from "./debug";

const debug = Debug.extend("hash");

export function md5(input: string) {
	const hash = createHash("md5").update(input).digest("hex");
	debug(hash);
	return hash;
}
