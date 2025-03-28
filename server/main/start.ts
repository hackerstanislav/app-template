import express from "express";
import { ServerHandlers, ServerOptions, ServerReturn } from "./types";
import { initializeMiddlewares } from "./common/middlewares";
import { initializeDefaultLogger } from "./common/logger";
import { buildState, ServerState } from "./common/state";
import { initializeHandlers } from "./common/events";
import { initializeRoutes } from "./common/routes";
import { createSocket } from "./common/sockets";
import { createServer } from "./common/http";
import { initializeAuth } from "./common/sso";
import { deferred } from "./common/utils";

import { createDatabase, createRoutes } from "./implementation";

export function startServer(
	opts: ServerOptions,
	handlers: ServerHandlers = {},
): ServerReturn {
	const app = express();
	const server = createServer(app);
	const socket = createSocket(server);

	const state = buildState(server, socket, opts);

	initializeDefaultLogger(state);
	initializeHandlers(app, state, handlers);
	initializeMiddlewares(app, socket, state, createDatabase(app, state));
	initializeRoutes(app, state, createRoutes(app, state));
	initializeAuth(app, state);

	server.listen(state.instance.port, () => {
		//default state reports
		state.logger.logger?.listening({ port: state.instance.port });
		state.logger.logger?.cwd({ cwd: state.cwd });

		void state.initialized.resolve();
	});

	return disposeServer(state);
}

function disposeServer(state: ServerState): ServerReturn {
	return {
		dispose: async () => {
			// Close the server and socket
			await state.socket.close();
			state.server.close();
			state.cache.flushAll();
			state.cache.close();
			state.initialized = deferred();

			return Promise.resolve();
		},
	};
}
