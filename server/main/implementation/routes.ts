import { Express, Router } from "express";

import { RouterHandlers } from "../common/routes";
import { ServerState } from "../common/state";

/**
 * Create routes for the application.
 *
 * This function is a placeholder for the real implementation of the routes. For now it just logs an error about the
 * missing implementation. There need to be a real implementation of the routes in the final application that can be
 * used to define the routes for the application. By default, login, logout, register and invite routes are defined
 * in  this template application.
 *
 * @param app - The express app.
 * @param state - The server state.
 */
export function createRoutes(
	app: Express,
	state: ServerState,
): (handlers: RouterHandlers) => Router[] {
	return () => {
		state.logger.logger?.error({
			message: "Routes must be implemented in real application.",
		});
		return [];
	};
}
