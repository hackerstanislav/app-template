import { ServerState } from "./common/state";

export function exitError(state: ServerState, error: Error) {
	if (state.logger.logger) {
		state.logger.logger.fatal({
			message: error.message,
			stack: error.stack ?? "No stack trace available.",
		});
	}
	process.exit(1);
}
