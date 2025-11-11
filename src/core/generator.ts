import { spawn } from "node:child_process";
import Debug from "../lib/debug";
import Timer from "../lib/timer";
import { DEFAULT_DOCKER_TAG } from "./const";
import type { ChildProcessWithoutNullStreams } from "node:child_process";
import type { DockerTag } from "../types";

const debug = Debug.extend("generator");

/**
 * Generate an `.stl` from a given `.scad` file
 */
export async function scad2stl(
	launchPath: string,
	files: Files,
): Promise<ScadExportResult> {
	const timer = new Timer();
	return new Promise<ScadExportResult>((resolve, reject) => {
		const lines: string[] = [];
		let scadProcess: ChildProcessWithoutNullStreams;

		if (launchPath.startsWith("docker")) {
			const dockerTag = launchPath.split(":")[1];
			scadProcess = spawnDockerOpenSCAD(dockerTag, files);
		} else {
			scadProcess = spawnOpenSCAD(launchPath, files);
		}

		scadProcess.on("spawn", () => timer.start());

		scadProcess.stderr.on("data", (data) => {
			debug.extend("stdout")(data.toString());
			lines.push(data.toString());
		});

		scadProcess.on("error", (err) => {
			reject({ output: err, ok: false });
		});

		scadProcess.on("close", (exitCode) => {
			const duration = timer.readAndReset();
			debug.extend("close")({ exitCode, duration });
			resolve({
				ok: exitCode === 0,
				output: lines,
				duration,
				exitCode,
			});
		});
	});
}

export function spawnOpenSCAD(launchPath: string, files: Files) {
	debug("launchPath: %o", launchPath);
	debug("files: %O", files);

	return spawn(launchPath, ["-o", files.out, files.in]);
}

export function spawnDockerOpenSCAD(tag: DockerTag | undefined, files: Files) {
	const dockerImage = `openscad/openscad:${tag ?? DEFAULT_DOCKER_TAG}`;
	const uid = process.getuid?.() ?? 1000;
	const gid = process.getgid?.() ?? 1000;
	const inFile = files.in.replace(files.cwd, ".");
	const outFile = files.out.replace(files.cwd, ".");

	const args = [
		"run",
		"--rm",
		"-v",
		`${files.cwd}:/openscad`,
		"-u",
		`${uid}:${gid}`,
		dockerImage,
		"openscad",
		"-o",
		outFile,
		inFile,
	];

	debug("docker: %O", args);
	debug("files: %O", files);

	return spawn("docker", args);
}

type ScadExportResult = {
	ok: boolean;
	output: string[];
	exitCode: number | null;
	duration: number;
};

type Files = {
	cwd: string;
	in: string;
	out: string;
};
