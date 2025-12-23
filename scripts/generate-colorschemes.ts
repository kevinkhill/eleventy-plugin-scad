import { rename as moveFile } from "node:fs/promises";
import path from "node:path";
import { OpenSCAD } from "../src";
import { COLOR_SCHEMES } from "../src/core";

const cwd = import.meta.dirname;
const scad = new OpenSCAD(cwd, {
	input: "turnercube.scad",
	thumbnailOnly: true,
});

for (const scheme of COLOR_SCHEMES) {
	const output = `turnercube_${scheme}.stl`;
	const image = output.replace(/stl$/, "png");

	scad.setOutput(output);
	scad.setColorScheme(scheme);

	await scad.export("docker");
	await moveFile(
		path.join(cwd, image), //
		path.join(cwd, "..", "images", image),
	);

	console.log("exported %s", output);
}
