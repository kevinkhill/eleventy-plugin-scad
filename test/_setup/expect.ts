import { existsSync } from "node:fs";
import { expect } from "vitest";

expect.extend({
	toStartWithString(received: string, expected: string) {
		const { isNot } = this;
		return {
			// do not alter your "pass" based on isNot. Vitest does it for you
			pass: String(received).startsWith(expected),
			message: () =>
				`${received} does${isNot ? " not" : ""} start with "${expected}"`,
		};
	},

	toEndWithString(received: string, expected: string) {
		const { isNot } = this;
		return {
			// do not alter your "pass" based on isNot. Vitest does it for you
			pass: String(received).endsWith(expected),
			message: () =>
				`${received} does${isNot ? " not" : ""} end with "${expected}"`,
		};
	},

	toExist(received: string) {
		const { isNot } = this;
		return {
			// do not alter your "pass" based on isNot. Vitest does it for you
			pass: existsSync(received),
			message: () =>
				`${received} ${isNot ? "" : "does not"} exist${isNot ? "s" : ""}`,
			// message: () => `${lessPath} does${isNot ? " not" : ""} exist`,
		};
	},
});
