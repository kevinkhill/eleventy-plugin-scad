import type { EleventyJavascriptClassTemplate } from "../../types";

class Demo implements EleventyJavascriptClassTemplate {
	data() {
		return {
			name: "Ted",
		} as const;
	}

	render({ name }: ReturnType<Demo["data"]>) {
		console.log("rendering TED");
		// will always be "Ted"
		return `<p>${name}</p>`;
	}
}

export default Demo;
