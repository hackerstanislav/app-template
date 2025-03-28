import http from "node:http";
import NodeCache from "node-cache";
import io from "socket.io";

import { createKindeAuthProvider } from "../sso/kinde";
import { Logger, LoggerStore } from "../logger";
import { Deffered } from "../utils";
import { AuthStore } from "../database";

export interface ServerState<DS = unknown> {
	logger: {
		logger: Logger | null;
		database: string;
		instance: LoggerStore | null;
		silent: boolean;
	};
	initialized: Deffered<void>;
	instance: {
		host: string;
		port: number;
	};
	sessions: {
		database: string;
		ttl: number;
		secure: boolean;
		secrets: string | string[];
	};
	store: {
		database: string;
		instance: DS | null;
		auth: AuthStore | null;
	};
	socket: io.Server;
	server: http.Server;
	cwd: string;
	staticFolder: string;
	version: string;
	deployment: "alpha" | "beta" | "production";
	auth: {
		kinde: {
			instance: null | ReturnType<typeof createKindeAuthProvider>;
			domain: string;
			clientId: string;
			clientSecret: string;
			redirectURL: string;
			logoutURL: string;
		};
	};
	cache: NodeCache;
}
