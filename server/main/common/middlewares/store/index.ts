import { RequestHandler } from "express";
import { Db } from "mongodb";

import { exitError } from "../../../exit";
import { ServerState } from "../../state";
import { ExpressSocketHandler } from "../types";
import { connectDatabaseStore } from "../../database";

export function makeStore<DS>(
	state: ServerState,
	create: (db: Db) => DS,
): [RequestHandler, ExpressSocketHandler] {
	initializeStore(state, create);

	return [
		(req, res, next) => {
			req.store = state.store.instance;
			req.auth = state.store.auth;
			next();
		},
		(socket, next) => {
			socket.store = state.store.instance;
			socket.auth = state.store.auth;
			next();
		},
	];
}

function initializeStore<DS>(state: ServerState, create: (db: Db) => DS) {
	state.initialized.touch();
	connectDatabaseStore({ uri: state.store.database, create })
		.then(({ store, auth }) => {
			state.store.instance = store;
			state.store.auth = auth;
			state.logger.logger?.database({ database: state.store.database });
			void state.initialized.resolve();
		})
		.catch((err: unknown) => {
			void state.initialized.reject(err as Error);
			exitError(state, err as Error);
		});
}
