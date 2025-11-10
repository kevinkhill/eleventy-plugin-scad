import { spawn } from "node:child_process";
import Debug from "../lib/debug";
import Timer from "../lib/timer";
import type { ChildProcessWithoutNullStreams } from "node:child_process";

const timer = new Timer();
const debug = Debug.extend("generator");

type ScadExportResult = {
	ok: boolean;
	output: string[];
	exitCode: number | null;
	duration: number;
};

/**
 * Generate an `.stl` from a given `.scad` file
 */
export async function scad2stl(
	launchPath: string,
	files: { in: string; out: string },
): Promise<ScadExportResult> {
	return new Promise<ScadExportResult>((resolve, reject) => {
		const lines: string[] = [];
		let scadProcess: ChildProcessWithoutNullStreams;

		if (launchPath === "docker") {
			scadProcess = spawnDockerOpenSCAD(files);
		} else {
			scadProcess = spawnOpenSCAD(launchPath, files);
		}

		scadProcess.on("spawn", () => timer.start());

		scadProcess.stdout.on("data", (data) => {
			debug("[stdout] %s", data.toString());
		});

		scadProcess.stderr.on("data", (data) => {
			// const lines = String(data).split("\n");
			// lines.forEach((line) => void debug("[stderr] %s", line));
			lines.push(data.toString());
		});

		scadProcess.on("error", (err) => {
			reject({ output: err, ok: false });
		});

		scadProcess.on("close", (exitCode) => {
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

/**
 * Spawn OpenSCAD using the given launch path
 */
export function spawnOpenSCAD(
	launchPath: string,
	files: { in: string; out: string },
) {
	debug("files: %O", files);
	debug("launchPath: %o", launchPath);

	return spawn(launchPath, ["--o", files.out, files.in]);
}

export function spawnDockerOpenSCAD(files: { in: string; out: string }) {
	const uid = process.getuid?.() ?? 1000;
	const gid = process.getgid?.() ?? 1000;
	const pwd = process.cwd();

	const args = [
		"run",
		"--rm",
		"-v",
		`${pwd}:/openscad`,
		"-u",
		`${uid}:${gid}`,
		"openscad/openscad:latest",
		"openscad",
		"-o",
		files.out,
		files.in,
	] as const;

	debug("files: %O", files);
	debug("args: %O", args);

	return spawn("docker", args);
}
