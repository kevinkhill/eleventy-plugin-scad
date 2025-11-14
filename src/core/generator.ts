import { spawn } from "cross-spawn";
import { DEFAULT_DOCKER_TAG } from "../config";
import { Debug, mkdirForFileAsync, relativePathFromCwd, Timer } from "../lib";
import type { ChildProcessWithoutNullStreams } from "node:child_process";

const debug = Debug.extend("generator");

/**
 * Generate an `.stl` from a given `.scad` file
 */
export async function scad2stl(
	launchPath: string,
	files: Files,
): Promise<ScadExportResult> {
	const stlResult = Promise.withResolvers<ScadExportResult>();
	const timer = new Timer();
	const lines: string[] = [];

	debug("files: %O", files);

	let scadProcess: ChildProcessWithoutNullStreams;
	try {
		// Writing of the html file actually creates the dir it belongs in, so
		// relying on that mechanism to save STLs was failing as they are generated
		// as part of that process, creating a race condition. Maybe a transformer
		// would be more appropriate?
		await mkdirForFileAsync(files.out);

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

// #region spawn native
/**
 * Generate STL using installed OpenSCAD
 */
export function spawnOpenSCAD(files: Files, launchPath: string) {
	const inFile = relativePathFromCwd(files.cwd, files.in);
	const outFile = relativePathFromCwd(files.cwd, files.out);
	const spawnArgs = makeScadArgs(inFile, outFile);

	debug.extend("spawn")({ launchPath, spawnArgs });

	return spawn(launchPath, spawnArgs, { cwd: files.cwd });
}
// #endregion

// #region spawn docker
/**
 * Generate STL using Docker OpenSCAD
 */
export function spawnDockerOpenSCAD(files: Files, tag?: string) {
	const uid = process.getuid?.() ?? 1000;
	const gid = process.getgid?.() ?? 1000;
	const inFile = relativePathFromCwd(files.cwd, files.in);
	const outFile = relativePathFromCwd(files.cwd, files.out);

	const dockerImage =
		tag === "latest"
			? `openscad/openscad`
			: `openscad/openscad:${tag ?? DEFAULT_DOCKER_TAG}`;

	const dockerArgs = [
		"run",
		"--rm",
		"-u",
		`${uid}:${gid}`,
		"-v",
		`${files.cwd}:/openscad`,
		dockerImage,
	];

	const scadArgs = makeScadArgs(inFile, outFile);
	const spawnArgs = [...dockerArgs, "openscad", ...scadArgs];

	debug.extend("spawn")({ dockerImage, spawnArgs });

	return spawn("docker", spawnArgs, { cwd: files.cwd });
}
// #endregion

// #region helpers
/**
 * Build the command line arguments needed to export STLs with OpenSCAD
 */
export function makeScadArgs(inFile: string, outFile: string): string[] {
	const args: string[] = ["--export-format", "binstl", "--backend", "Manifold"];
	args.push("--o", outFile, inFile);
	return args;
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
