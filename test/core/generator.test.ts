import { writeFile } from "node:fs/promises";
import path from "node:path";
import { temporaryDirectory } from "tempy";
import { describe, expect, it } from "vitest";
import { scad2stl } from "../../src/core/generator";
import type { DockerLaunchId } from "../../src";

describe("scad2stl() with docker containers", () => {
	const engines: DockerLaunchId[] = [
		"docker",
		"docker:trixie",
		"docker:bookworm",
	];

	for (const engine of engines) {
		it(`uses "${engine}" to convert SCAD to STL`, async () => {
			const tempDir = temporaryDirectory();

			const inFile = path.join(tempDir, "cube.scad");
			const outFile = path.join(tempDir, "cube.stl");

			await writeFile(inFile, Buffer.from("cube(1);"));

			await scad2stl(engine, {
				cwd: tempDir,
				in: inFile,
				out: outFile,
			});

			expect(outFile).toExist();
		});
	}
});
