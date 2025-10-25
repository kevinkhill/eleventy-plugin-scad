import { spawn } from "node:child_process";
import { debug } from "../lib";

type ScadExportResult = {
	output: string[];
	ok: boolean;
};

let workerId = 0;

/**
 * Generate an `.stl` from a given `.scad` file
 */
export async function scad2stl(
	launchPath: string,
	files: { in: string; out: string },
): Promise<ScadExportResult> {
	const debugWorker = debug.extend(`worker${workerId++}`);

	debugWorker("spawned %s", launchPath);
	debugWorker("input: %s", files.in);
	debugWorker("output: %s", files.out);

	const { promise, resolve, reject } =
		Promise.withResolvers<ScadExportResult>();

	const scad = spawn(launchPath, ["--o", files.out, files.in]);
	const output: string[] = [];

	scad.stdout.on("data", (data) => {
		debugWorker("[stdout] %s", data.toString());
	});

	scad.stderr.on("data", (data) => {
		const lines = String(data).split("\n");
		lines.forEach((line) => void debugWorker("[stderr] %s", line));
		output.push(data.toString());
	});

	scad.on("error", (err) => {
		debugWorker("!ERROR! %s", err.message);
		reject({ output: err, ok: false });
	});

	scad.on("close", (exitCode) => {
		debugWorker("process closed");
		resolve({ output, ok: exitCode === 0 });
	});

	return promise;
}
