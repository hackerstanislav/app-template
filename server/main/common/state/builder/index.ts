import NodeCache from "node-cache";
import http from "node:http";
import io from "socket.io";

import { deferred } from "../../utils";
import { ServerOptions } from "../../../types";
import { ServerState } from "../types";

//1 year
export const YEAR = 1000 * 60 * 60 * 24 * 365;

export function buildState(
	server: http.Server,
	socket: io.Server,
	opts: ServerOptions,
): ServerState {
	const host = opts.host ?? "http://localhost";
	const port = opts.port;

	return {
		server,
		socket,
		logger: {
			database: opts.logger?.database ?? "mongodb://127.0.0.1:27001/app-logger",
			silent: opts.logger?.silent ?? false,
			logger: null,
			instance: null,
		},
		cache: new NodeCache({
			stdTTL: 60 * 10, //10 minutes
		}),
		cwd: opts.cwd,
		version: opts.version,
		deployment: opts.deployment,
		staticFolder: opts.staticFolder,
		initialized: deferred(),
		instance: {
			host,
			port,
		},
		sessions: {
			database:
				opts.sessions?.database ?? "mongodb://127.0.0.1:27001/app-sessions",
			ttl: opts.sessions?.ttl ?? YEAR,
			secrets: opts.sessions?.secrets ?? "ade8bd55-0d42-468e-bcba-631c3b2f6895",
			secure: opts.sessions?.secure ?? false,
		},
		store: {
			database: opts.store?.database ?? "mongodb://127.0.0.1:27001/app-data",
			instance: null,
			auth: null,
		},
		auth: {
			kinde: {
				instance: null,
				domain: "",
				clientId: "",
				clientSecret: "",
				redirectURL: "",
				logoutURL: "",
				...opts.kinde,
			},
		},
	};
}
