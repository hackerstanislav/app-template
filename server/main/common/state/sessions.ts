import { Locals } from "express";
import { Session, SessionData } from "express-session";
import assert from "node:assert";

import { SessionStore } from "../middlewares";

type Sessions = Session & Partial<SessionData>;

export interface StoreContainer<DS = unknown> {
	session?: Sessions | null;
	handshake?: {
		session?: Sessions | null;
	};
	store?: DS | null;
}

export function getLogged<LU>(
	container: StoreContainer,
	locals: Record<string, NonNullable<unknown>> & Locals,
) {
	const session = getSessionStore(container);
	const logged = session.logged ?? locals.logged;

	assert(logged, "Logged user is not found in session.");
	return logged as LU;
}

function getSessionStore(container: StoreContainer): SessionStore {
	if (container.session) {
		return container.session as SessionStore;
	}
	if (container.handshake && container.handshake.session) {
		return container.handshake.session as SessionStore;
	}
	throw new Error(
		`Invalid store object. Need to be object that contains "session" or "handshake.session" property.`,
	);
}
