import type { EleventyJavascriptClassTemplate } from "../../types";

class Demo implements EleventyJavascriptClassTemplate {
	data = () =>
		({
			name: "Ted",
		}) as const;

	render({ name }) {
		console.log("rendering TED");
		// will always be "Ted"
		return `<p>${name}</p>`;
	}
}

export default Demo;
