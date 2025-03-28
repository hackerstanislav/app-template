import { Session, SessionData } from "express-session";
import { Socket } from "socket.io";

import { LoginData } from "../routes";
import { ServerState } from "../state";
import { AuthStore } from "../database";

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			state: ServerState;
			auth: AuthStore | null;
			store: unknown;
		}
	}

	interface Handshake {
		session: Express.Request["session"];
	}
}

export interface ExpressSocket<DS = unknown> extends Socket {
	state: ServerState;
	auth: AuthStore | null;
	store: DS;
}

export type SessionStore = Session &
	Partial<SessionData> & {
		kinde?: Record<string, unknown>;
		logged?: LoginData | null;
	};

export type ExpressSocketHandler = (
	socket: ExpressSocket,
	fn: (err?: Error) => void,
) => void;
export type SocketHandler = (socket: Socket, fn: (err?: Error) => void) => void;
