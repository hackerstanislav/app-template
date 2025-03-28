import { Express } from "express";

import { ServerHandlers } from "../../types";
import { ServerState } from "../state";

export function initializeHandlers(
	_app: Express,
	state: ServerState,
	handlers: ServerHandlers,
) {
	// Wait for the server to be initialized and then call the onStarted handler
	void state.initialized.then(() => {
		if (handlers.onStarted) {
			handlers.onStarted();
		}
	});
}
