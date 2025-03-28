import { Express, Router } from "express";
import asyncHandler from "express-async-handler";

import { ServerState } from "../state";

import {
	getDefaultHandler,
	postDefaultHandler,
	deleteDefaultHandler,
	putDefaultHandler,
	getResourceHandler,
} from "./handlers";
import { RouterHandlers } from "./types";
import { handlerErrors } from "./errors";
import { routeAuth } from "./auth";

export * from "./types";

export function initializeRoutes(
	app: Express,
	state: ServerState,
	routes: (handlers: RouterHandlers) => Router[],
) {
	const router = Router();

	//wait for server to be initialized
	router.all(
		"*",
		asyncHandler(async (req, res, next) => {
			await state.initialized;
			next();
		}),
	);

	//router all
	router.use("/", [
		routeAuth(app, state),
		...routes({
			get: getDefaultHandler,
			post: postDefaultHandler,
			delete: deleteDefaultHandler,
			put: putDefaultHandler,
			resource: getResourceHandler,
		}),
	]);

	//api mount
	app.use("/", router);

	//errors
	handlerErrors(app, state);
}
