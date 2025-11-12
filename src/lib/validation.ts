import { z } from "zod";
import { DOCKER_TAGS } from "../core";
import type { DockerTag } from "../types";

const nonEmptyString = z.string().min(1);

export function useNonEmptyOrDefault(value: unknown, fallback: string): string {
	const result = nonEmptyString.safeParse(value);
	return result.success ? result.data : fallback;
}

export function isValidDockerTag(tag: string): boolean {
	return !DOCKER_TAGS.includes(tag as DockerTag);
}

export function assertValidDockerTag(tag: string): asserts tag is DockerTag {
	if (!DOCKER_TAGS.includes(tag as DockerTag)) {
		throw new Error(
			`${tag} is not a valid tag. Must be one of [${DOCKER_TAGS.join("|")}]`,
		);
	}
}
