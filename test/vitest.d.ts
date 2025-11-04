import "vitest";

interface CustomMatchers<R = unknown> {
	toExist: () => R;
	toStartWithString: (expected: string) => R;
	toEndWithString: (expected: string) => R;
}

declare module "vitest" {
	// biome-ignore lint/suspicious/noExplicitAny: https://vitest.dev/guide/extending-matchers.html#extending-matchers
	interface Matchers<T = any> extends CustomMatchers<T> {}
}
