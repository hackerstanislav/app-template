import { Express, RequestHandler, Router } from "express";
import asyncHandler from "express-async-handler";

import { ServerState } from "../state";

import { handleAuthenticate } from "./auth";
import { builder } from "./builder";
import { createHttpError } from "./errors";

export function getDefaultHandler(
	app: Express,
	state: ServerState,
	path: string,
	additionalHandlers: RequestHandler[],
	getHandler: (app: Express, state: ServerState) => RequestHandler,
) {
	const router = Router();
	const { url } = builder(path);
	router
		.route(url)
		.get(
			authenticateHandler(state, true),
			...additionalHandlers,
			getHandler(app, state),
		);
	return router;
}

export function getResourceHandler(
	app: Express,
	state: ServerState,
	path: string,
	getHandler: (app: Express, state: ServerState) => RequestHandler,
) {
	const router = Router();
	const { url } = builder(path);
	router
		.route(url)
		.get(authenticateHandler(state, false), getHandler(app, state));
	return router;
}

export function postDefaultHandler(
	app: Express,
	state: ServerState,
	path: string,
	additionalHandlers: RequestHandler[],
	postHandler: (app: Express, state: ServerState) => RequestHandler,
) {
	const router = Router();
	const { url } = builder(path);
	router
		.route(url)
		.post(
			authenticateHandler(state, true),
			...additionalHandlers,
			postHandler(app, state),
		);
	return router;
}

export function putDefaultHandler(
	app: Express,
	state: ServerState,
	path: string,
	additionalHandlers: RequestHandler[],
	putHandler: (app: Express, state: ServerState) => RequestHandler,
) {
	const router = Router();
	const { url } = builder(path);
	router
		.route(url)
		.put(
			authenticateHandler(state, true),
			...additionalHandlers,
			putHandler(app, state),
		);
	return router;
}

export function deleteDefaultHandler(
	app: Express,
	state: ServerState,
	path: string,
	additionalHandlers: RequestHandler[],
	deleteHandler: (app: Express, state: ServerState) => RequestHandler,
) {
	const router = Router();
	const { url } = builder(path);
	router
		.route(url)
		.delete(
			authenticateHandler(state, true),
			...additionalHandlers,
			deleteHandler(app, state),
		);
	return router;
}

function authenticateHandler(
	state: ServerState,
	needLogin: boolean,
): RequestHandler {
	return asyncHandler(async (req, res, next) => {
		const profile = await handleAuthenticate(state, req);

		// Profile is null if user is not logged in
		if (!profile && needLogin) {
			next(createHttpError(`User is not logged in.`, 403, 0));
			return;
		}

		// Set logged user to locals
		res.locals.logged = profile;
		next();
	});
}
