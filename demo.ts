import Eleventy from "@11ty/eleventy";

try {
	const eleventy = new Eleventy("in", "out");

	eleventy.write();
	eleventy.toJSON();
} catch (e) {
	console.error(e);
}
