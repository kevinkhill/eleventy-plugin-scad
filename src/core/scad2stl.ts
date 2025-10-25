import { spawn } from "node:child_process";
import { debug } from "../lib";

type ProcessedScadFile = {
	outLines: string[];
	errLines: string[];
	exitCode: number | null;
};

let workerId = 0;

/**
 * Generate an `.stl` from a given `.scad` file
 */
export async function scad2stl(
	launchPath: string,
	files: { in: string; out: string },
): Promise<{ output: string[]; ok: boolean }> {
	const debugWorker = debug.extend(`worker${workerId++}`);

	return new Promise<{ output: string[]; ok: boolean }>((resolve, reject) => {
		const output: string[] = [];
		const scad = spawn(launchPath, ["--o", files.out, files.in]);
		debugWorker("spawned %s", launchPath);

		scad.stdout.on("data", (data) => {
			debugWorker("[stdout] %s", data.toString());
		});

		scad.stderr.on("data", (data) => {
			const lines = String(data).split("\n");
			lines.forEach((line) => void debugWorker("[stderr] %s", line));
			output.push(data.toString());
		});

		scad.on("error", (err) => {
			debugWorker("[ERROR] %s", err.message);
			reject({ output: err, ok: false });
		});

		scad.on("close", (exitCode) => {
			debugWorker("process closed");
			resolve({ output, ok: exitCode === 0 });
		});
	});
}

/**
 * Generate an `.stl` from a given `.scad` file
 */
export async function scad2stl__v1(
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
