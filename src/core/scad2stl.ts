import { spawn } from "node:child_process";
import Debug from "../lib/debug";

const debug = Debug.extend("stl");

/**
 * Generate an `.stl` from a given `.scad` file
 */
export async function scad2stl(
	launchPath: string,
	files: { in: string; out: string },
): Promise<ScadExportResult> {
	const result = Promise.withResolvers<ScadExportResult>();
	const lines: string[] = [];
	const input = normalPath(files.in);
	const output = normalPath(files.out);

	debug("input: %s", input);
	debug("output: %s", output);

	const scad = spawn(launchPath, ["--o", output, input]);

	scad.stdout.on("data", (data) => {
		debug("[stdout] %s", data.toString());
	});

	scad.stderr.on("data", (data) => {
		// const lines = String(data).split("\n");
		// lines.forEach((line) => void debug("[stderr] %s", line));
		lines.push(data.toString());
	});

	scad.on("error", (err) => {
		result.reject({ output: err, ok: false });
	});

	scad.on("close", (exitCode) => {
		// debug("done");
		result.resolve({ output: lines, ok: exitCode === 0 });
	});

	return result.promise;
}

type ScadExportResult = {
	output: string[];
	ok: boolean;
};

function normalPath(path: string) {
	return `./${path.replace(/^\.?\/?/, "")}`;
}
