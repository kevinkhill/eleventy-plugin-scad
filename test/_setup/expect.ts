import { expect } from "vitest";

expect.extend({
	toMatchStartOfString(received: string, expected: string) {
		const { isNot } = this;
		return {
			// do not alter your "pass" based on isNot. Vitest does it for you
			pass: received.startsWith(expected),
			message: () =>
				`${received} does${isNot ? " not" : ""} start with "${expected}"`,
		};
	},
	toMatchEndOfString(received: string, expected: string) {
		const { isNot } = this;
		return {
			// do not alter your "pass" based on isNot. Vitest does it for you
			pass: received.endsWith(expected),
			message: () =>
				`${received} does${isNot ? " not" : ""} end with "${expected}"`,
		};
	},
});
