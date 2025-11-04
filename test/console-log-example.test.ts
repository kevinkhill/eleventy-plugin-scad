import { afterAll, describe, expect, it, vi } from "vitest";

describe("should mock console.log", () => {
	const consoleMock = vi
		.spyOn(console, "log")
		.mockImplementation(() => undefined);

	afterAll(() => {
		consoleMock.mockReset();
	});

	it("should log `sample output`", () => {
		console.log("sample output");
		expect(consoleMock).toHaveBeenCalledOnce();
		expect(consoleMock).toHaveBeenLastCalledWith("sample output");
	});
});
