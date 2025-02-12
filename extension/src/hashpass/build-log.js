import { createWriteStream } from "fs";
import { spawn } from "child_process";

const timestamp = new Date().toISOString();
const logFile = "build-log.txt";

const startTime = Date.now();
const buildProcess = spawn("npx", ["next", "build"], { shell: true });

const logStream = createWriteStream(logFile, { flags: "a" });

logStream.write(`\n\n==== Build Log: ${timestamp} ====\n`);
console.log(`\nBuild started at: ${timestamp}`);

buildProcess.stdout.on("data", (data) => {
    process.stdout.write(data);
    logStream.write(data);
});

buildProcess.stderr.on("data", (data) => {
    process.stderr.write(data);
    logStream.write(`${data}`);
});

buildProcess.on("close", (code) => {
    const endTime = Date.now();
    const buildDuration = ((endTime - startTime) / 1000).toFixed(2);
    const status = code === 0 ? "Build Successful!" : "Build Failed!";

    logStream.write(`\n${status}\nBuild Duration: ${buildDuration} seconds\n`);
    console.log(`\nBuild log updated: ${logFile}`);

    logStream.end();
});
