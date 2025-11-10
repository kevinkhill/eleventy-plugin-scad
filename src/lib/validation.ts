import { z } from "zod";

const nonEmptyString = z.string().min(1);

export function useNonEmptyOrDefault(value: unknown, fallback: string): string {
	const result = nonEmptyString.safeParse(value);
	return result.success ? result.data : fallback;
}
