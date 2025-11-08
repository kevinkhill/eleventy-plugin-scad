import { spawn } from "node:child_process";
import Debug from "../lib/debug";
import Timer from "../lib/timer";

const timer = new Timer();
const debug = Debug.extend("generator");

/**
 * Generate an `.stl` from a given `.scad` file
 */
export async function scad2stl(
	launchPath: string,
	files: { in: string; out: string },
): Promise<ScadExportResult> {
	return new Promise<ScadExportResult>((resolve, reject) => {
		const lines: string[] = [];
		const input = normalPath(files.in);
		const output = normalPath(files.out);

		debug("input: %o", input);
		debug("output: %o", output);

		const scad = spawn(launchPath, ["--o", output, input]);

		scad.on("spawn", () => timer.start());

		scad.stdout.on("data", (data) => {
			debug("[stdout] %s", data.toString());
		});

		scad.stderr.on("data", (data) => {
			// const lines = String(data).split("\n");
			// lines.forEach((line) => void debug("[stderr] %s", line));
			lines.push(data.toString());
		});

		scad.on("error", (err) => {
			reject({ output: err, ok: false });
		});

		scad.on("close", (exitCode) => {
			const result: ScadExportResult = {
				ok: exitCode === 0,
				output: lines,
				duration: timer.duration,
				exitCode,
			};
			debug("result: %O", result);
			resolve(result);
		});
	});
}

type ScadExportResult = {
	ok: boolean;
	output: string[];
	exitCode: number | null;
	duration: number;
};

function normalPath(path: string) {
	return `./${path.replace(/^\.?\/?/, "")}`;
}
