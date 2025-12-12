import { writeFile } from "node:fs/promises";
import path from "node:path";
import { temporaryDirectory } from "tempy";
import { describe, expect, it } from "vitest";
import { scadExporter } from "../../src/core/exporter";
import type { DockerLaunchTag } from "../../src";

describe("scad2stl() with docker containers", () => {
	const engines: DockerLaunchTag[] = [
		"docker:dev",
		// "docker:latest",
		"docker:trixie",
		"docker:bookworm",
	];

	for (const engine of ["docker", ...engines]) {
		it(`uses "${engine}" to convert SCAD to STL`, async () => {
			const tempDir = temporaryDirectory();

			const inFile = path.join(tempDir, "cube.scad");
			const outFile = path.join(tempDir, "cube.stl");

			await writeFile(inFile, Buffer.from("cube(1);"));

			await scadExporter(engine, {
				cwd: tempDir,
				in: inFile,
				out: outFile,
			});

			expect(outFile).toExist();
		});
	}
});

// describe.runIf()(`scad2stl()`, () => {
// 	it(`uses "openscad-nightly" to convert SCAD to STL`, async () => {
// 		const tempDir = temporaryDirectory();

// 		const inFile = path.join(tempDir, "cube.scad");
// 		const outFile = path.join(tempDir, "cube.stl");

// 		await writeFile(inFile, Buffer.from("cube(1);"));

// 		await scad2stl("openscad-nightly", {
// 			cwd: tempDir,
// 			in: inFile,
// 			out: outFile,
// 		});

// 		expect(outFile).toExist();
// 	});
// });
