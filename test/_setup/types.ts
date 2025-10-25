export type EleventyPageJSON = {
	/** The output URL route for this render */
	url: string;

	/** Input .scad file path */
	inputPath: string;

	/** Output HTML file path */
	outputPath: string;

	/** Raw OpenSCAD code (e.g. "cube(10);") */
	rawInput: string;

	/** Full rendered HTML content */
	content: string;
};
