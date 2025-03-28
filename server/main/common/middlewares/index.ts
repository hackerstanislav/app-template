import { Express } from "express";
import { Server } from "socket.io";
import { Db } from "mongodb";

import { ServerState } from "../state";

import { makeSessions } from "./session";
import { makeCookies } from "./cookies";
import { makeContent } from "./content";
import { makeStatic } from "./static";
import { makeState } from "./state";
import { makeStore } from "./store";
import { SocketHandler, SessionStore } from "./types";

export { SessionStore };

export function initializeMiddlewares<DS>(
	app: Express,
	socket: Server,
	state: ServerState,
	databaseStore: (db: Db) => DS,
) {
	const [httpState, socketState] = makeState(state);
	app.use(httpState);
	socket.use(socketState as SocketHandler);

	const [httpDbStore, socketDbStore] = makeStore(state, databaseStore);
	app.use(httpDbStore);
	socket.use(socketDbStore as SocketHandler);

	const cookies = makeCookies(state);
	app.use(cookies);

	const [httpSessions, socketSessions] = makeSessions(state, cookies);
	app.use(httpSessions);
	socket.use(socketSessions as SocketHandler);

	app.use(makeContent());
	app.use(makeStatic(state));
}
