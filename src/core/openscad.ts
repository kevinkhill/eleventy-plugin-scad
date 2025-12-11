import { spawn } from "cross-spawn";
import { DEFAULT_DOCKER_TAG } from "../config";
import { Debug, relativePathFromCwd } from "../lib";
import type { Files, ThumbnailColorScheme } from "../types";

const _debug = Debug.extend("openscad");

/**
 * Generate STL using installed OpenSCAD
 */
export function spawnOpenSCAD(
	files: Files,
	launchPath: string,
	colorScheme?: ThumbnailColorScheme,
) {
	const debug = _debug.extend("native");
	const inFile = relativePathFromCwd(files.cwd, files.in);
	const outFile = relativePathFromCwd(files.cwd, files.out);
	const spawnArgs = makeScadArgs(inFile, outFile, colorScheme);

	debug("launch path: %o", launchPath);
	debug("spawn args: %O", spawnArgs);

	return spawn(launchPath, spawnArgs, { cwd: files.cwd });
}

/**
 * Generate STL using Docker OpenSCAD
 */
export function spawnDockerOpenSCAD(
	files: Files,
	tag?: string,
	colorScheme?: ThumbnailColorScheme,
) {
	const debug = _debug.extend("docker");
	const inFile = relativePathFromCwd(files.cwd, files.in);
	const outFile = relativePathFromCwd(files.cwd, files.out);

	const uid = process.getuid?.() ?? 1000;
	const gid = process.getgid?.() ?? 1000;
	const dockerImage = `openscad/openscad:${tag ?? DEFAULT_DOCKER_TAG}`;
	const dockerArgs = [
		"run",
		"--rm",
		"-u",
		`${uid}:${gid}`,
		"-v",
		`${files.cwd}:/openscad`,
		dockerImage,
	];

	const scadArgs = makeScadArgs(inFile, outFile, colorScheme);
	const spawnArgs = [...dockerArgs, "openscad", ...scadArgs];

	debug("using image: %o", dockerImage);
	debug("spawn args: %O", spawnArgs);

	return spawn("docker", spawnArgs, { cwd: files.cwd });
}

/**
 * Build the command line arguments needed to export STLs and PNGs
 *
 * @link https://en.wikibooks.org/wiki/OpenSCAD_User_Manual/Using_OpenSCAD_in_a_command_line_environment#Command_line_usage
 */
function makeScadArgs(
	inFile: string,
	outFile: string,
	colorScheme: ThumbnailColorScheme = "Cornfield",
): string[] {
	return [
		// use the new faster backend
		["--backend", "Manifold"],
		// prefer binary stl over ascii
		// ["--export-format", format === "stl" ? "binstl" : "png"],
		// output STL
		["--o", outFile],
		// output PNG
		["--o", outFile.replace(/stl$/, "png")],
		["--colorscheme", colorScheme],
		// input SCAD file
		inFile,
	].flat(2);
}
