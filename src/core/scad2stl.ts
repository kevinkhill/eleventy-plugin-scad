import { spawn } from "node:child_process";
import Debug from "../lib/debug";

const debug = Debug.extend("scad2stl");

/**
 * Generate an `.stl` from a given `.scad` file
 */
export async function scad2stl(
	launchPath: string,
	files: { in: string; out: string },
): Promise<ScadExportResult> {
	debug("input: %s", files.in);
	debug("output: %s", files.out);

	const { promise, resolve, reject } =
		Promise.withResolvers<ScadExportResult>();

	const scad = spawn(launchPath, ["--o", files.out, files.in]);
	const output: string[] = [];

	scad.stdout.on("data", (data) => {
		debug("[stdout] %s", data.toString());
	});

	scad.stderr.on("data", (data) => {
		// const lines = String(data).split("\n");
		// lines.forEach((line) => void debug("[stderr] %s", line));
		output.push(data.toString());
	});

	scad.on("error", (err) => {
		reject({ output: err, ok: false });
	});

	scad.on("close", (exitCode) => {
		// debug("done");
		resolve({ output, ok: exitCode === 0 });
	});

	return promise;
}

type ScadExportResult = {
	output: string[];
	ok: boolean;
};
