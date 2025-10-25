import { spawn } from "node:child_process";

/**
 * Generate an `.stl` from a given `.scad` file
 */
export async function scad2stl(
  launchPath: string,
  files: { in: string; out: string }
) {
  const { promise, resolve, reject } =
    Promise.withResolvers<ProcessedScadFile>();
  const outLines: string[] = [];
  const errLines: string[] = [];

  const scad = spawn(launchPath, ["--o", files.out, files.in]);
  scad.stdout.on("data", (data) => outLines.push(data));
  scad.stderr.on("data", (data) => errLines.push(data));
  scad.on("error", (err) => reject(err));
  scad.on("close", (exitCode) => resolve({ outLines, errLines, exitCode }));

  return await promise;
}

type ProcessedScadFile = {
  outLines: string[];
  errLines: string[];
  exitCode: number | null;
};
