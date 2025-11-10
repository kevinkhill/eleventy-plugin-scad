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

		debug("input: %o", files.in);
		debug("output: %o", files.out);

		const scad = spawn(launchPath, ["--o", files.out, files.in]);

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
