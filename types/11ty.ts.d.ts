import "11ty.ts";

declare module "11ty.ts" {
	interface EleventyDirs {
		input: string;
		inputFile?: string;
		inputGlob?: string;
		data: string;
		includes: string;
		layouts?: string;
		output: string;
	}

	interface EleventyData {
		directories: EleventyDirs;
	}
}
