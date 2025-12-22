import { readFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "cross-spawn";
import { DEFAULT_DOCKER_TAG } from "../config";
import { Debug, mkdirForFileAsync, Timer } from "../lib";
import { parseTomlFrontMatter } from "./frontmatter";
import type { ChildProcessWithoutNullStreams } from "node:child_process";
import type { Debugger } from "debug";
import type {
	DockerLaunchTag,
	Files,
	PluginOptions,
	ScadExportResult,
	ThumbnailColorScheme,
} from "../types";

export class OpenSCAD {
	debug: Debugger;
	inFile!: string;
	outFile!: string;
	scadProcess!: ChildProcessWithoutNullStreams;
	colorscheme: ThumbnailColorScheme;

	constructor(public cwd: string) {
		this.cwd = cwd;
		this.colorscheme = "Cornfield";

		this.debug = Debug.extend("worker");
	}

	/**
	 * Build the command line arguments needed to export STLs and PNGs
	 *
	 * @link https://en.wikibooks.org/wiki/OpenSCAD_User_Manual/Using_OpenSCAD_in_a_command_line_environment#Command_line_usage
	 */
	get scadArgs(): string[] {
		const pngFile = this.outFile.replace(/stl$/, "png");

		return [
			// Can't use this option while exporting both stl and png in one spawn
			// ["--export-format", "binstl"], // prefer binary stl over ascii
			["--backend", "Manifold"], // use the new faster backend
			["--colorscheme", this.colorscheme], // thumbnail colors
			["--o", this.outFile], // output STL
			["--o", pngFile], // output PNG
			this.inFile, // input SCAD file
		].flat(2);
	}

	setInput(input: string) {
		this.inFile = input;
		this.debug("inFile set: %O", this.inFile);
		return this;
	}

	setOutput(output: string) {
		this.outFile = output;
		this.debug("outFile set: %O", this.outFile);
		return this;
	}

	setColorScheme(scheme: ThumbnailColorScheme) {
		this.colorscheme = scheme;
		return this;
	}

	async getFrontMatter() {
		const scadContent = await readFile(this.inFile, "utf8");
		return parseTomlFrontMatter(scadContent);
	}

	/**
	 * Generate an `.stl` from a given `.scad` file
	 */
	async export(
		launchPath: DockerLaunchTag | PluginOptions["launchPath"],
	): Promise<ScadExportResult> {
		const stlResult = Promise.withResolvers<ScadExportResult>();
		const timer = new Timer();

		try {
			const lines: string[] = [];

			// Create the output dir if it does not already exist
			const outfileAbspath = path.join(this.cwd, this.outFile);
			await mkdirForFileAsync(outfileAbspath);

			if (launchPath.startsWith("docker") || launchPath.endsWith("docker")) {
				const dockerTag = launchPath.split(":")[1];
				this.scadProcess = this.spawnDocker(dockerTag);
			} else {
				this.scadProcess = this.spawnNative(launchPath);
			}

			this.scadProcess.on("spawn", () => {
				timer.start();
			});

			this.scadProcess.stderr.on("data", (data) => {
				this.debug.extend("stderr")(data.toString());
				lines.push(data.toString());
			});

			this.scadProcess.stdout.on("data", (data) => {
				this.debug.extend("stdout")(data.toString());
			});

			this.scadProcess.on("error", (err) => {
				this.debug.extend("error")(err);
				stlResult.reject({ output: err, ok: false });
			});

			this.scadProcess.on("close", (exitCode) => {
				const duration = timer.readAndReset();
				this.debug.extend("close")({ exitCode, duration });
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

	/**
	 * Generate STL using installed OpenSCAD
	 */
	spawnNative(launchPath: string) {
		const spawnArgs = this.scadArgs;

		this.debug("using native launch path: %o", launchPath);
		this.debug("spawn args: %O", spawnArgs);

		return spawn(launchPath, spawnArgs, { cwd: this.cwd });
	}

	/**
	 * Generate STL using Docker OpenSCAD
	 */
	spawnDocker(tag?: string) {
		const uid = process.getuid?.() ?? 1000;
		const gid = process.getgid?.() ?? 1000;
		const dockerImage = `openscad/openscad:${tag ?? DEFAULT_DOCKER_TAG}`;
		const dockerArgs = [
			"run",
			"--rm",
			"-u",
			`${uid}:${gid}`,
			"-v",
			`${this.cwd}:/openscad`,
			dockerImage,
		];

		const spawnArgs = [...dockerArgs, "openscad", ...this.scadArgs];

		this.debug("using docker image: %o", dockerImage);
		this.debug("spawn args: %O", spawnArgs);

		return spawn("docker", spawnArgs, { cwd: this.cwd });
	}

	static create(
		args: Files & { colorscheme?: ThumbnailColorScheme },
	): OpenSCAD {
		const instance = new OpenSCAD(args.cwd);
		instance.setInput(args.in);
		instance.setOutput(args.out);
		if (args.colorscheme) {
			instance.setColorScheme(args.colorscheme);
		}
		return instance;
	}
}
