declare module "@11ty/eleventy-utils" {
	const TemplatePath: {
		/** Returns the absolute path to Eleventy’s project directory. */
		getWorkingDir(): string;

		/** Returns the directory portion of a path. */
		getDir(path: string): string;

		/** Returns the directory portion of a file path. */
		getDirFromFilePath(filePath: string): string;

		/** Returns the last path segment in a path. */
		getLastPathSegment(path: string): string;

		/** Returns an array of directories in a path (from deepest to shallowest). */
		getAllDirs(path: string): string[];

		/** Normalizes a path, resolving single-dot and double-dot segments. */
		normalize(thePath: string): string;

		/** Joins and normalizes multiple path segments. */
		join(...paths: string[]): string;

		/** Joins URL-style path segments and normalizes them. */
		normalizeUrlPath(...urlPaths: string[]): string;

		/** Joins path segments to form an absolute path. */
		absolutePath(...paths: string[]): string;

		/** Returns a path relative to the project directory. */
		relativePath(absolutePath: string): string;

		/** Adds a leading "./" to all paths in an array. */
		addLeadingDotSlashArray(paths: string[]): string[];

		/** Adds a leading "./" to a path if missing. */
		addLeadingDotSlash(pathArg: string): string;

		/** Removes a leading "./" segment if present. */
		stripLeadingDotSlash(path: string): string;

		/** Returns true if `path` starts with `subPath`. */
		startsWithSubPath(path: string, subPath: string): boolean;

		/** Removes a leading subPath from path, if present. */
		stripLeadingSubPath(path: string, subPath: string): string;

		/** Returns true if the path is a directory (sync). */
		isDirectorySync(path: string): boolean;

		/** Returns true if the path is a directory (async). */
		isDirectory(path: string): Promise<boolean>;

		/** Appends recursive glob pattern if path is a directory (sync). */
		convertToRecursiveGlobSync(path: string): string;

		/** Appends recursive glob pattern if path is a directory (async). */
		convertToRecursiveGlob(path: string): Promise<string>;

		/** Returns the file extension without leading dot. */
		getExtension(thePath: string): string;

		/** Removes the given extension from path (if present). */
		removeExtension(path: string, extension?: string): string;

		/**
		 * Converts a standardized path (e.g. using "/") into one using
		 * the local OS file separator.
		 */
		normalizeOperatingSystemFilePath(filePath: string, sep?: string): string;

		/**
		 * Converts a local OS-specific path into a standardized ("/")-based one.
		 */
		standardizeFilePath(filePath: string, sep?: string): string;
	};

	// biome-ignore lint/style/useExportType: This needs to be importable to use, not just a type
	export { TemplatePath };
}
