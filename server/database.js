/* eslint-disable */
const fs = require("fs/promises");
const path = require("path");
const process = require("child_process");

async function main() {
	const sessions = path.join(__dirname, "../.database");
	await fs.mkdir(sessions, { recursive: true });
	const sessionsProcess = process.spawn("mongod", [
		"--dbpath",
		sessions,
		"--port",
		27001,
	]);
	processEvents(sessionsProcess);
}

function processEvents(child) {
	child.stdout.on("data", (data) => {
		const messages = data.toString().split("\n");
		messages.forEach((message) => console.log(message));
	});
	child.stderr.on("data", (data) => {
		const messages = data.toString().split("\n");
		messages.forEach((message) => console.log(message));
	});
	child.on("close", (code) => {
		console.info(`Database process exited with code ${code}.`);
	});
}

main();
