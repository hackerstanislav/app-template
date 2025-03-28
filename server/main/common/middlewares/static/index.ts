import express from "express";
import path from "node:path";

import { ServerState } from "../../state";

export function makeStatic(state: ServerState) {
	const folder = path.resolve(state.cwd, state.staticFolder);

	//serving public file
	if (state.logger.logger) {
		state.logger.logger.public({ folder });
	}
	return express.static(folder);
}
