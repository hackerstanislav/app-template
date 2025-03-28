import { RequestHandler } from "express";
import sessions from "express-session";
import mongodbSession from "connect-mongodb-session";
import sharedSession from "express-socket.io-session";

import { exitError } from "../../../exit";
import { ServerState } from "../../state";
import { ExpressSocketHandler } from "../types";

export function makeSessions(
	state: ServerState,
	cookies: RequestHandler,
): [RequestHandler, ExpressSocketHandler] {
	const secret = state.sessions.secrets;

	if (state.logger.logger) {
		state.logger.logger.info({
			message: `Sessions will be initialized and max session age is ${state.sessions.ttl.toString()} ms`,
		});
	}

	const store = makeSessionStore(state);
	const session = sessions({
		secret: secret,
		store: store,
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: state.sessions.ttl,
			secure: state.sessions.secure,
		},
	});

	//session middleware
	return [session, sharedSession(session, cookies, { autoSave: true })];
}

function makeSessionStore(state: ServerState) {
	const MongoDBStore = mongodbSession(sessions);

	return new MongoDBStore(
		{
			uri: state.sessions.database,
			collection: "sessions",
		},
		(err: Error | undefined) => {
			if (!err) {
				state.logger.logger?.database({ database: state.sessions.database });
			} else {
				exitError(state, err);
			}
		},
	);
}
