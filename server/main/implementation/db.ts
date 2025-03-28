import { Db } from "mongodb";
import { Express } from "express";

import { ServerState } from "../common/state";

export function createDatabase(
	app: Express,
	state: ServerState,
): (db: Db) => unknown {
	return () => {
		state.logger.logger?.error({
			message: "Database store must be implemented in real application.",
		});
		return {};
	};
}
