import path from "node:path";
import { Debug, mkdirForFileAsync, Timer } from "../lib";
import { spawnDockerOpenSCAD, spawnOpenSCAD } from "./openscad";
import type { ChildProcessWithoutNullStreams } from "node:child_process";
import type { Files, ScadExportResult } from "../types";

const debug = Debug.extend("export");

/**
 * Generate an `.stl` from a given `.scad` file
 */
export async function scadExporter(
	launchPath: string,
	files: Files,
): Promise<ScadExportResult> {
	const stlResult = Promise.withResolvers<ScadExportResult>();
	const timer = new Timer();
	const lines: string[] = [];

	debug("files: %O", files);

	try {
		let scadProcess: ChildProcessWithoutNullStreams;

		// Create the output dir if it does not already exist
		const outfileAbspath = path.join(files.cwd, files.out);
		await mkdirForFileAsync(outfileAbspath);

		if (launchPath.startsWith("docker") || launchPath.endsWith("docker")) {
			const dockerTag = launchPath.split(":")[1];
			scadProcess = spawnDockerOpenSCAD(files, dockerTag);
		} else {
			scadProcess = spawnOpenSCAD(files, launchPath);
		}

		scadProcess.on("spawn", () => {
			timer.start();
		});

		scadProcess.stderr.on("data", (data) => {
			debug.extend("stderr")(data.toString());
			lines.push(data.toString());
		});

		scadProcess.stdout.on("data", (data) => {
			debug.extend("stdout")(data.toString());
		});

		scadProcess.on("error", (err) => {
			debug.extend("error")(err);
			stlResult.reject({ output: err, ok: false });
		});

		scadProcess.on("close", (exitCode) => {
			const duration = timer.readAndReset();
			debug.extend("close")({ exitCode, duration });
			stlResult.resolve({
				ok: exitCode === 0,
				output: lines,
				duration,
				exitCode,
			});
		});
	} catch (e) {
		stlResult.reject(e);
	}

	return stlResult.promise;
}
