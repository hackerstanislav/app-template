import { ServerOptions, ServerReturn } from "./types";
import { startServer } from "./start";
import { get } from "./cli";

//module

export { startServer, ServerOptions, ServerReturn };

//cli

const {
	cwd,
	commands,
	port,
	host,
	staticFolder,
	kinde,
	database,
	secret,
	secure,
	version,
	deployment,
} = get(process);

if (commands.includes("start")) {
	startServer({
		cwd,
		host,
		port,
		staticFolder,
		kinde,
		version,
		deployment,
		logger: {
			database: database.logger,
		},
		store: {
			database: database.store,
		},
		sessions: {
			database: database.sessions,
			secrets: secret,
			secure: secure,
		},
	});
}
