/**
 * Build the command line arguments needed to export STLs with OpenSCAD
 */
export function makeArgsForOpenSCAD(
	inFile: string,
	outFile: string,
	options?: {
		exportFormat?: string;
		backend?: "CGAL" | "Manifold";
	},
): string[] {
	const args: string[] = [];

	if (options?.exportFormat) {
		args.push("--export-format", options.exportFormat);
	}
	if (options?.backend) {
		args.push("--backend", options.backend);
	}

	args.push("--o", outFile, inFile);
	return args;
}
