import { Express } from "express";

import { exitError } from "../../exit";
import { ServerState } from "../state";

import { createKindeAuthProvider } from "./kinde";

export function initializeAuth(app: Express, state: ServerState) {
	const kinde = state.auth.kinde;

	// Create kinde instance if domain is set
	if (kinde.domain) {
		kinde.instance = createKindeAuthProvider(state);
		state.logger.logger?.auth({
			kinde,
		});

		if (!kinde.clientId) {
			exitError(
				state,
				new Error(
					"Kinde client id is not set, but is required to use. Define KINDE.clientId system variable or config variable.",
				),
			);
			return;
		}

		if (!kinde.clientId) {
			exitError(
				state,
				new Error(
					"Kinde client secret is not set, but is required to use. Define KINDE.clientSecret system variable or config variable.",
				),
			);
			return;
		}
	}
}
