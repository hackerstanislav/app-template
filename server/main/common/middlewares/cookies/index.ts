import cookies from "cookie-parser";

import { ServerState } from "../../state";

export function makeCookies(state: ServerState) {
	if (state.logger.logger) {
		state.logger.logger.info({
			message: `Cookie parser was initialized`,
		});
	}
	// cookie parser middleware
	return cookies();
}
