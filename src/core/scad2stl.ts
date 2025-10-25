import { spawn } from "node:child_process";

/**
 * Generate an `.stl` from a given `.scad` file
 */
export default async function (
	launchPath: string,
	files: { in: string; out: string },
) {
	return new Promise<ProcessedScadFile>((resolve, reject) => {
		const outLines: string[] = [];
		const errLines: string[] = [];

		const scad = spawn(launchPath, ["--o", files.out, files.in]);
		scad.stdout.on("data", (data) => outLines.push(data.toString()));
		scad.stderr.on("data", (data) => errLines.push(data.toString()));
		scad.on("error", (err) => reject(err));
		scad.on("close", (exitCode) => resolve({ outLines, errLines, exitCode }));
	});
}

type ProcessedScadFile = {
	outLines: string[];
	errLines: string[];
	exitCode: number | null;
};
