import path from "node:path";
import { blue, bold, cyan, gray, green, red, reset, yellow } from "yoctocolors";
import z, { prettifyError, stringbool, z as z$1 } from "zod";
import { createHash } from "node:crypto";
import { mkdir, readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { findUpSync } from "find-up";
import Debug from "debug";
import which from "which";
import { spawn } from "cross-spawn";
import "he";

//#region src/config.ts
/**
* Default W3C Core Style
*
* @link https://www.w3.org/StyleSheets/Core/
*/
const DEFAULT_PLUGIN_THEME = "Traditional";
/**
* Default OpenSCAD Docker tag
*
* @link https://hub.docker.com/r/openscad/openscad
*/
const DEFAULT_DOCKER_TAG = "dev";
/**
* Default `three.js` version
*
* @link https://www.npmjs.com/package/three
*/
const THREE_JS_VERSION = "0.180.0";

//#endregion
//#region src/lib/debug.ts
var debug_default = Debug("eleventy:scad");

//#endregion
//#region src/lib/assets.ts
const debug$8 = debug_default.extend("assets");
let assetPath = "";
/**
* Load an asset file from the bundle
*/
function getAssetFileContent(file) {
	const resPath = path.join(getAssetPath(), file);
	const content = readFileSync(resPath, "utf8");
	debug$8(`read from disk "%s"`, file);
	return content;
}
function getAssetPath() {
	if (assetPath === "") throw new Error(`"assetPath" is not set, was "ensureAssetPath()" called?`);
	return assetPath;
}
function ensureAssetPath() {
	debug$8(`ensuring asset path is set`);
	if (assetPath) debug$8(`assetPath = "%s"`, assetPath);
	else {
		debug$8(`searching "%s"`, import.meta.dirname);
		const found = findUpSync("assets", {
			cwd: import.meta.dirname,
			type: "directory"
		});
		if (!found) throw new Error(`"assets/" was not found!`);
		debug$8(`found "%s"`, found);
		assetPath = found;
	}
}

//#endregion
//#region src/lib/env.ts
const debug$7 = debug_default.extend("env");
function getOptionsFromEnv(env) {
	function getEnv(varName) {
		const value = env[varName];
		if (typeof value === "undefined") return;
		debug$7.extend("string")("%s=%o", varName, value);
		return value;
	}
	function parseStringBool(varName) {
		const value = env[varName];
		if (typeof value === "undefined") return;
		const result = stringbool().optional().parse(value);
		debug$7.extend("boolean")("%s=%o", varName, result);
		return result;
	}
	return {
		theme: getEnv("ELEVENTY_SCAD_THEME"),
		layout: getEnv("ELEVENTY_SCAD_LAYOUT"),
		launchPath: getEnv("ELEVENTY_SCAD_LAUNCH_PATH"),
		noStl: parseStringBool("ELEVENTY_SCAD_NO_STL"),
		silent: parseStringBool("ELEVENTY_SCAD_SILENT"),
		verbose: parseStringBool("ELEVENTY_SCAD_VERBOSE"),
		collectionPage: parseStringBool("ELEVENTY_SCAD_COLLECTION_PAGE"),
		resolveLaunchPath: parseStringBool("ELEVENTY_SCAD_RESOLVE_LAUNCH_PATH")
	};
}

//#endregion
//#region src/lib/fs.ts
const debug$6 = debug_default.extend("fs");
function exists(pathToCheck) {
	const state = existsSync(pathToCheck);
	debug$6({
		path: pathToCheck,
		exists: state
	});
	return state;
}
function relativePathFromCwd(cwd, file) {
	return `./${path.relative(cwd, file)}`;
}
/**
* Given the absolute path to a file, create the directories required to save it
*/
async function mkdirForFileAsync(filepath) {
	if (!path.isAbsolute(filepath)) throw new Error("mkdirForFileAsync() only works with absolute file paths");
	const directory = path.dirname(filepath);
	await mkdir(directory, { recursive: true });
}

//#endregion
//#region src/lib/logger.ts
function getLogger(eleventyConfig) {
	return eleventyConfig.logger;
}
function createScadLogger(eleventyConfig, errorLogger = false) {
	return (message) => getLogger(eleventyConfig).logWithOptions({
		message,
		color: errorLogger ? "red" : "yellow",
		type: errorLogger ? "error" : "log",
		prefix: reset(`[11ty/${yellow("scad")}]`)
	});
}

//#endregion
//#region src/lib/resolve.ts
/**
* Try to resolve a launch path or binary name.
*
* Returns the absolute path if found or null.
*/
function resolveOpenSCAD(launchPath) {
	const pathStr = String(launchPath);
	if (existsSync(pathStr)) return pathStr;
	return which.sync(pathStr, { nothrow: true });
}

//#endregion
//#region src/lib/scad-bin.ts
const debug$5 = debug_default.extend("bin");
/**
* Default OpenSCAD install locations
*
* @TODO: Need to verify this since I have nightly installed
*/
const SCAD_BIN = {
	linux: "openscad",
	darwin: "/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD",
	win32: "C:/Program Files/Openscad/openscad.exe"
};
/**
* Default OpenSCAD Nightly install locations
*/
const SCAD_BIN_NIGHTLY = {
	linux: "openscad-nightly",
	darwin: "/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD",
	win32: "C:/Program Files/Openscad/openscad-nightly.exe"
};
/**
* Alias mappings to use when installing the plugin into an eleventy project.
*
* @example ```
* import Eleventy from "@11ty/eleventy";
* import { EleventyPluginOpenSCAD, SCAD_BINS } from "eleventy-plugin-scad";
*
* const launchPath = SCAD_BINS.MACOS;
*```
*/
const SCAD_BINS = {
	LINUX: SCAD_BIN.linux,
	LINUX_NIGHTLY: SCAD_BIN_NIGHTLY.linux,
	MACOS: SCAD_BIN.darwin,
	MACOS_NIGHTLY: SCAD_BIN_NIGHTLY.darwin,
	WINDOWS: SCAD_BIN.win32,
	WINDOWS_NIGHTLY: SCAD_BIN_NIGHTLY.win32
};
/**
* Returns the OpenSCAD binary path for the current platform.
*/
function autoBinPath(platform, binType = "auto") {
	const binMap = binType === "nightly" ? SCAD_BIN_NIGHTLY : SCAD_BIN;
	const bin = binMap[platform];
	const retVal = typeof bin === "string" ? bin : null;
	debug$5("platform: %s", platform);
	debug$5("binType: %s", binType);
	debug$5("using: %s", retVal);
	return retVal;
}

//#endregion
//#region src/lib/timer.ts
var Timer = class {
	_started = NaN;
	_stopped = NaN;
	start() {
		this._started = Date.now();
		return this;
	}
	stop() {
		this._stopped = Date.now();
		return this;
	}
	reset() {
		this._started = 0;
		this._stopped = 0;
		return this;
	}
	readAndReset() {
		this.stop();
		const duration = (this._stopped - this._started) / 1e3;
		this.reset();
		return duration;
	}
};
var timer_default = Timer;

//#endregion
//#region src/lib/validation.ts
const nonEmptyString = z$1.string().min(1);
function useNonEmptyOrDefault(value, fallback) {
	const result = nonEmptyString.safeParse(value);
	return result.success ? result.data : fallback;
}

//#endregion
//#region src/core/cache.ts
const debug$4 = debug_default.extend("cache");
const $cache = new Map();
function getFileHash(key) {
	return $cache.get(key);
}
function isFileRegistered(file) {
	const status = $cache.has(file);
	debug$4({
		file,
		registered: status
	});
	return status;
}
function fileNeedsRegistration(file) {
	return isFileRegistered(file) === false;
}
async function fileHashesMatch(key) {
	const cachedHash = getFileHash(key);
	const scadContent = await readFile(key, "utf8");
	const newHash = md5(scadContent);
	const hashMatch = newHash === cachedHash;
	debug$4({
		key,
		cached: cachedHash,
		current: newHash
	});
	return hashMatch;
}
async function fileHashesDiffer(key) {
	return await fileHashesMatch(key) !== true;
}
async function updateHash(key) {
	const scadContent = await readFile(key, "utf8");
	const hash = md5(scadContent);
	$cache.set(key, hash);
}
async function registerFile(key) {
	updateHash(key);
	debug$4("registered: %o", key);
}
async function ensureFileRegistered(file) {
	if (fileNeedsRegistration(file)) await registerFile(file);
}
function md5(input) {
	return createHash("md5").update(input).digest("hex");
}

//#endregion
//#region package.json
var name = "eleventy-plugin-scad";

//#endregion
//#region src/core/const.ts
const PLUGIN_NAME = name;
const STL_EXT = "stl";
const DOT_STL = `.${STL_EXT}`;
const SCAD_EXT = "scad";
const DOT_SCAD = `.${SCAD_EXT}`;
const THEMES = [
	"Traditional",
	"Modernist",
	"Midnight",
	"Chocolate",
	"Oldstyle",
	"Steely",
	"Swiss",
	"Ultramarine"
];
const DEFAULT_SCAD_LAYOUT = "scad.viewer.njk";
const DEFAULT_COLLECTION_LAYOUT = "scad.collection.njk";

//#endregion
//#region src/core/generator.ts
const debug$3 = debug_default.extend("generator");
/**
* Generate an `.stl` from a given `.scad` file
*/
async function scad2stl(launchPath, files) {
	const stlResult = Promise.withResolvers();
	const timer = new timer_default();
	const lines = [];
	debug$3("files: %O", files);
	let scadProcess;
	try {
		const outfileAbspath = path.join(files.cwd, files.out);
		await mkdirForFileAsync(outfileAbspath);
		if (launchPath.startsWith("docker") || launchPath.endsWith("docker")) {
			const dockerTag = launchPath.split(":")[1];
			scadProcess = spawnDockerOpenSCAD(files, dockerTag);
		} else scadProcess = spawnOpenSCAD(files, launchPath);
		scadProcess.on("spawn", () => {
			timer.start();
		});
		scadProcess.stderr.on("data", (data) => {
			debug$3.extend("stderr")(data.toString());
			lines.push(data.toString());
		});
		scadProcess.stdout.on("data", (data) => {
			debug$3.extend("stdout")(data.toString());
		});
		scadProcess.on("error", (err) => {
			debug$3.extend("error")(err);
			stlResult.reject({
				output: err,
				ok: false
			});
		});
		scadProcess.on("close", (exitCode) => {
			const duration = timer.readAndReset();
			debug$3.extend("close")({
				exitCode,
				duration
			});
			stlResult.resolve({
				ok: exitCode === 0,
				output: lines,
				duration,
				exitCode
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
function spawnOpenSCAD(files, launchPath) {
	const inFile = relativePathFromCwd(files.cwd, files.in);
	const outFile = relativePathFromCwd(files.cwd, files.out);
	const spawnArgs = makeScadArgs(inFile, outFile);
	debug$3.extend("spawn")({
		launchPath,
		spawnArgs
	});
	return spawn(launchPath, spawnArgs, { cwd: files.cwd });
}
/**
* Generate STL using Docker OpenSCAD
*/
function spawnDockerOpenSCAD(files, tag) {
	const uid = process.getuid?.() ?? 1e3;
	const gid = process.getgid?.() ?? 1e3;
	const inFile = relativePathFromCwd(files.cwd, files.in);
	const outFile = relativePathFromCwd(files.cwd, files.out);
	const dockerImage = tag === "latest" ? `openscad/openscad` : `openscad/openscad:${tag ?? DEFAULT_DOCKER_TAG}`;
	const dockerArgs = [
		"run",
		"--rm",
		"-u",
		`${uid}:${gid}`,
		"-v",
		`${files.cwd}:/openscad`,
		dockerImage
	];
	const scadArgs = makeScadArgs(inFile, outFile);
	const spawnArgs = [
		...dockerArgs,
		"openscad",
		...scadArgs
	];
	debug$3.extend("spawn")({
		dockerImage,
		spawnArgs
	});
	return spawn("docker", spawnArgs, { cwd: files.cwd });
}
/**
* Build the command line arguments needed to export STLs with OpenSCAD
*/
function makeScadArgs(inFile, outFile) {
	const args = [
		"--export-format",
		"binstl",
		"--backend",
		"Manifold"
	];
	args.push("--o", outFile, inFile);
	return args;
}

//#endregion
//#region src/core/options.ts
/**
* Default plugin options
*/
const DEFAULT_OPTIONS = {
	launchPath: `docker:${DEFAULT_DOCKER_TAG}`,
	theme: DEFAULT_PLUGIN_THEME,
	layout: void 0,
	resolveLaunchPath: true,
	collectionPage: true,
	verbose: true,
	noSTL: false,
	silent: false
};
const debug$2 = debug_default.extend("options");
const StringBoolSchema = z.union([z.boolean(), z.stringbool()]);
const PluginOptionsSchema = z.object({
	launchPath: z.preprocess((val) => {
		if (val === "auto" || val === "nightly") return autoBinPath(process.platform, val ?? "auto");
		return val;
	}, z.string().default(DEFAULT_OPTIONS.launchPath)),
	layout: z.nullish(z.string()),
	theme: z.optional(z.enum(THEMES)).default(DEFAULT_PLUGIN_THEME),
	noSTL: z.optional(StringBoolSchema).default(DEFAULT_OPTIONS.noSTL),
	silent: z.optional(StringBoolSchema).default(DEFAULT_OPTIONS.silent),
	verbose: z.optional(StringBoolSchema).default(DEFAULT_OPTIONS.verbose),
	collectionPage: z.optional(StringBoolSchema).default(DEFAULT_OPTIONS.collectionPage),
	resolveLaunchPath: z.optional(StringBoolSchema).default(DEFAULT_OPTIONS.resolveLaunchPath)
});
function parseOptions(options, env = process.env) {
	const envOptions = getOptionsFromEnv(env);
	debug$2("environment: %O", envOptions);
	debug$2("user: %O", options);
	const mergedOptions = Object.assign({}, envOptions, options);
	debug$2("merged: %O", mergedOptions);
	const parsedOptions = PluginOptionsSchema.safeParse(mergedOptions);
	debug$2("parsed: %O", parsedOptions);
	return parsedOptions;
}

//#endregion
//#region src/core/shortcodes.ts
const debug$1 = debug_default.extend("shortcodes");
/**
* Helper Shortcodes for generating pages from scad templates
*/
function addShortcodes(eleventyConfig) {
	const registerShortcode = (name$1, filter) => {
		eleventyConfig.addShortcode(name$1, filter);
		debug$1(`added "%s"`, name$1);
	};
	debug$1("defaultTheme: %o", DEFAULT_PLUGIN_THEME);
	/**
	* Link tag with url for themes created by w3.org
	*
	* @example {% w3_theme_css %}
	* @link https://www.w3.org/StyleSheets/Core/preview
	*/
	registerShortcode("w3_theme_css", (userTheme) => {
		const $theme = useNonEmptyOrDefault(userTheme, DEFAULT_PLUGIN_THEME);
		const url = `https://www.w3.org/StyleSheets/Core/${$theme}`;
		return `<link rel="stylesheet" href="${url}">`;
	});
	/**
	* Import Maps for three.js
	*
	* @example {% threejs_importmap %}
	*/
	registerShortcode("threejs_importmap", () => {
		const cdn_base = `https://cdn.jsdelivr.net/npm/three@${THREE_JS_VERSION}`;
		const importmap = { imports: {
			three: `${cdn_base}/build/three.module.js`,
			"three/addons/": `${cdn_base}/examples/jsm/`
		} };
		return `<script type="importmap">${JSON.stringify(importmap)}</script>`;
	});
}

//#endregion
//#region src/core/templates.ts
const log = debug_default.extend("templates");
function addBuiltinScadLayoutVirtualTemplate(eleventyConfig) {
	log(`(virtual) adding "%o"`, DEFAULT_SCAD_LAYOUT);
	eleventyConfig.addTemplate(`_includes/${DEFAULT_SCAD_LAYOUT}`, getAssetFileContent(DEFAULT_SCAD_LAYOUT), {});
}
function addScadCollectionVirtualTemplate(eleventyConfig) {
	log(`(virtual) adding "%o"`, DEFAULT_COLLECTION_LAYOUT);
	eleventyConfig.addTemplate(`_includes/${DEFAULT_COLLECTION_LAYOUT}`, getAssetFileContent(DEFAULT_COLLECTION_LAYOUT), {});
	const DEFAULT_COLLECTION_TEMPLATE = "index.njk";
	eleventyConfig.addTemplate(DEFAULT_COLLECTION_TEMPLATE, `<ul>
			{% for item in collections.scad %}
          		<li><a href="{{ item.data.slug | url }}">{{ item.data.title }}</a></li>
        	{% endfor %}
		</ul>`, { layout: DEFAULT_COLLECTION_LAYOUT });
	log(`(virtual) added "%o"`, DEFAULT_COLLECTION_TEMPLATE);
}

//#endregion
//#region src/plugin.ts
const debug = debug_default.extend("core");
/**
* Eleventy Plugin for OpenSCAD
*
* @param {EleventyConfig} eleventyConfig
* @param {PluginOptionsInput} options
*/
function EleventyPluginOpenSCAD(eleventyConfig, options) {
	try {
		if (!("addTemplate" in eleventyConfig)) throw new Error(`Virtual Templates are required for this plugin, please use Eleventy v3.0 or newer.`);
	} catch (e) {
		console.log(`[${PLUGIN_NAME}] WARN Eleventy plugin compatibility: ${e.message}`);
	}
	ensureAssetPath();
	const log$1 = createScadLogger(eleventyConfig);
	const parsedOptions = parseOptions(options);
	if (parsedOptions.error) {
		const message = prettifyError(parsedOptions.error);
		log$1(red(message));
		throw new Error(message);
	}
	const { theme, noSTL, layout, silent, verbose, launchPath, collectionPage, resolveLaunchPath } = parsedOptions.data;
	/** logger that can be silenced */
	const _log = (it) => {
		if (!silent) log$1(it);
	};
	let resolvedScadBin = launchPath;
	if (resolveLaunchPath) {
		resolvedScadBin = resolveOpenSCAD(launchPath);
		if (resolvedScadBin === null) {
			const message = `The launchPath "${launchPath}" does not exist.`;
			log$1(red(message));
			throw new Error(message);
		}
	}
	_log(`${gray("Theme:")} ${reset(theme)}`);
	_log(`${gray("Spawn:")} ${(launchPath === "docker" ? cyan : blue)(String(launchPath))}`);
	_log([
		gray(" Opts:"),
		silent ? green("+silent") : "",
		verbose ? green("+verbose") : "",
		noSTL ? red("-noSTL") : "",
		!resolveLaunchPath ? red("-resolveLaunchPath") : "",
		!collectionPage ? red("-collectionPage") : ""
	].join(" ").replaceAll(/\s+/g, " "));
	addShortcodes(eleventyConfig);
	addBuiltinScadLayoutVirtualTemplate(eleventyConfig);
	if (collectionPage) addScadCollectionVirtualTemplate(eleventyConfig);
	/**
	* Register `.scad` files as virtual template files and
	* define they are to be compiled into html & stl files.
	*/
	eleventyConfig.addTemplateFormats(SCAD_EXT);
	eleventyConfig.addExtension(SCAD_EXT, {
		getData(inputPath) {
			const filename = path.basename(inputPath);
			const data = {
				title: filename,
				slug: filename.replace(DOT_SCAD, ""),
				scadFile: inputPath,
				stlFile: filename.replace(DOT_SCAD, DOT_STL),
				layout: layout ?? DEFAULT_SCAD_LAYOUT,
				theme: theme ?? DEFAULT_PLUGIN_THEME,
				tags: [SCAD_EXT]
			};
			debug.extend("getData")({
				inputPath,
				data
			});
			return data;
		},
		async compile(inputContent, inputPath) {
			return async (data) => {
				try {
					if (noSTL) {
						_log(`${cyan("Would write")} ${data.stlFile} ${gray(`from ${inputPath}`)}`);
						return inputContent;
					}
					const elevenDirs = data.eleventy.directories;
					const projectRoot = data.eleventy.env.root;
					/** `.scad` source */
					const inFile = path.relative(projectRoot, data.page.inputPath);
					const stlOutputDir = path.relative(projectRoot, path.join(elevenDirs.output, data.page.fileSlug));
					/** `.stl` target */
					const outFile = path.join(stlOutputDir, data.stlFile);
					await ensureFileRegistered(inFile);
					const stlExists = exists(outFile);
					const hashesDiffer = await fileHashesDiffer(inFile);
					debug.extend("compile")({
						inFile,
						outFile,
						projectRoot,
						pageData: data.page,
						stlExists,
						hashesDiffer
					});
					if (!stlExists || hashesDiffer) {
						_log(`${reset("Writing")} ${data.stlFile} ${gray(`from ${inputPath}`)}`);
						const scadResult = await scad2stl(String(resolvedScadBin), {
							cwd: projectRoot,
							in: inFile,
							out: outFile
						});
						if (!scadResult.ok) {
							log$1(red("OpenSCAD encountered an issue"));
							for (const line of scadResult.output) {
								const cleanLine = line.replaceAll("\n", "");
								log$1(red(cleanLine));
							}
							return inputContent;
						}
						updateHash(inFile);
						if (verbose) {
							const lines = scadResult.output.flatMap((l) => l.split("\n"));
							for (const line of lines) _log(gray(`\t${line}`));
						}
						const duration = scadResult.duration.toFixed(2);
						_log(green(`Wrote ${bold(data.stlFile)} in ${bold(duration)} seconds`));
					} else debug("%o is up to date; skipped", path.basename(outFile));
				} catch (e) {
					const err = e;
					console.error(`[${PLUGIN_NAME}] ERR ${err.message}`);
				}
				return inputContent;
			};
		}
	});
}

//#endregion
//#region src/core/register.ts
function addOpenSCADPlugin(eleventyConfig, options) {
	eleventyConfig.addPlugin(EleventyPluginOpenSCAD, options);
}

//#endregion
//#region src/index.ts
var src_default = EleventyPluginOpenSCAD;

//#endregion
export { EleventyPluginOpenSCAD, SCAD_BINS, addOpenSCADPlugin, src_default as default };