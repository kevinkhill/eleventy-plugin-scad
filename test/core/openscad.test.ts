import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { OpenSCAD } from "../../src";
import type { DockerLaunchTag } from "../../src";

describe("OpenSCAD with docker containers", () => {
	const dockerTags: DockerLaunchTag[] = [
		"docker:dev",
		"docker:trixie",
		"docker:bookworm",
	];

	for (const tag of ["docker", ...dockerTags]) {
		it(`uses "${tag}" to convert SCAD to STL`, async () => {
			const tempDir = tmpdir();
			const inFile = path.join(tempDir, "cube.scad");
			const outFile = path.join(tempDir, "cube.stl");

			await writeFile(inFile, Buffer.from("cube(1);"));

			const openscad = OpenSCAD.create({
				cwd: tempDir,
				in: "cube.scad",
				out: "cube.stl",
			});

			await openscad.export(tag);

			expect(outFile).toExist();
		});
	}
});
