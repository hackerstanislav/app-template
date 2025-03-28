import { RequestHandler } from "express";

import { ServerState } from "../../state";
import { ExpressSocketHandler } from "../types";

export function makeState(
	state: ServerState,
): [RequestHandler, ExpressSocketHandler] {
	return [
		(req, res, next) => {
			req.state = state;
			next();
		},
		(socket, next) => {
			socket.state = state;
			next();
		},
	];
}
