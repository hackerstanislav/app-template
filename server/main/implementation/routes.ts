import { Express, Router } from "express";

import { RouterHandlers } from "../common/routes";
import { ServerState } from "../common/state";

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
