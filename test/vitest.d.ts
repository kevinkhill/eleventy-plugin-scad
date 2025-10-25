import "vitest";

interface CustomMatchers<R = unknown> {
	toExist: () => R;
	toMatchStartOfString: (expected: string) => R;
	toMatchEndOfString: (expected: string) => R;
}

declare module "vitest" {
	// biome-ignore lint/suspicious/noExplicitAny: https://vitest.dev/guide/extending-matchers.html#extending-matchers
	interface Matchers<T = any> extends CustomMatchers<T> {}
}

// interface ExpectationResult {
// 	pass: boolean;
// 	message: () => string;
// 	// If you pass these, they will automatically appear inside a diff when
// 	// the matcher does not pass, so you don't need to print the diff yourself
// 	actual?: unknown;
// 	expected?: unknown;
// }
