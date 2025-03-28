import { Db } from "mongodb";
import { Express } from "express";

import { ServerState } from "../common/state";

/**
 * Database store type, used to specify the database store and real implementation.
 */
export type DatabaseStore = unknown;

/**
 * Create a database store.
 *
 * This function is a placeholder for the real implementation of the database store. For now it just logs an error
 * about the missing implementation. There need to be a real implementation of the database store in the final
 * application that can be used to interact with the database.
 *
 * @param app - The express app.
 * @param state - The server state.
 * @returns A function that creates a database store.
 */
export function createDatabase(
	app: Express,
	state: ServerState,
): (db: Db) => DatabaseStore {
	return () => {
		state.logger.logger?.error({
			message: "Database store must be implemented in real application.",
		});
		return {};
	};
}
