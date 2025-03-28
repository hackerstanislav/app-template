import chalk from "chalk";

import { exitError } from "../../exit";
import { ServerState } from "../state";

import { connectDatabaseLogger } from "./database";

export function initializeDefaultLogger(state: ServerState) {
	state.initialized.touch();

	initializeDbConnector(state);
	initializeLogger(state);
}

function initializeDbConnector(state: ServerState) {
	connectDatabaseLogger({ uri: state.logger.database })
		.then((store) => {
			state.logger.instance = store;
			state.logger.logger?.database({ database: state.logger.database });
			void state.initialized.resolve();
		})
		.catch((err: unknown) => {
			void state.initialized.reject(err as Error);
			exitError(state, err as Error);
		});
}

function initializeLogger(state: ServerState) {
	state.logger.logger = {
		listening: ({ port }) => {
			const type = "[listening]";
			consoleLog(
				state,
				"log",
				`${prependType(type)}${chalk.bold.whiteBright.greenBright(type)} ${chalk.bold.whiteBright(`Server listening on port`)} ${chalk.bold.greenBright(`http://localhost:${port.toString()}`)}`,
			);
		},
		database: ({ database }) => {
			const type = "[database]";
			consoleLog(
				state,
				"log",
				`${prependType(type)}${chalk.bold.whiteBright.greenBright(type)} ${chalk.bold.whiteBright(`Connected do database `)} ${chalk.bold.greenBright(database)}`,
			);
		},
		cwd: ({ cwd }) => {
			const type = "[cwd]";
			consoleLog(
				state,
				"log",
				`${prependType(type)}${chalk.bold.blue(type)} ${chalk.italic.whiteBright(`Current working directory is`)} ${chalk.blueBright(cwd)}`,
			);
		},
		public: ({ folder }) => {
			const type = "[public]";
			consoleLog(
				state,
				"log",
				`${prependType(type)}${chalk.bold.green(type)} ${chalk.italic.whiteBright(`Public folder for serving UI is`)} ${chalk.blueBright(folder)}`,
			);
		},
		fatal: ({ message, prepend, stack, traceId, code }) => {
			const type = "[fatal]";
			consoleLog(state, "log", "");
			consoleLog(
				state,
				"error",
				`${prependType(type)}${chalk.bold.whiteBright.redBright(type)}${prependPrepend(prepend)} ${chalk.bold.redBright(message)}${code ? chalk.bold.gray(` (code: ${code.toString()})`) : ""}${traceId ? chalk.bold.gray(` (traceId: ${traceId})`) : ""}`,
			);
			if (stack) {
				consoleLog(
					state,
					"error",
					`${prependType(type)}${chalk.bold.whiteBright.redBright(type)}${prependPrepend(prepend)} ${chalk.italic.gray(stack)}`,
				);
			}
		},
		success: ({ message, prepend }) => {
			const type = "[success]";
			consoleLog(
				state,
				"log",
				`${prependType(type)}${chalk.bold.green(type)}${prependPrepend(prepend)} ${chalk.bold.greenBright(message)}`,
			);
		},
		auth: ({ kinde }) => {
			const type = "[auth]";

			if (kinde.domain) {
				consoleLog(
					state,
					"log",
					`${prependType(type)}${chalk.bold.magentaBright(type)} ${chalk.bold.whiteBright(`Kinde authentication is setup and will be available.`)}`,
				);
			}
		},

		//rest errors
		rest: {
			error: async (err: { message: string; code?: number }, opts = {}) => {
				if (state.logger.instance && state.logger.logger) {
					const { traceId } = await state.logger.instance.error(err);
					state.logger.logger.error({
						prepend: opts.prepend,
						message: err.message,
						code: err.code,
						traceId,
					});
					return {
						traceId,
					};
				}
				return {
					traceId: "",
				};
			},
			fatal: async (err, opts = {}) => {
				if (state.logger.instance && state.logger.logger) {
					const { traceId } = await state.logger.instance.fatal(err);
					state.logger.logger.fatal({
						prepend: opts.prepend,
						message: err.message,
						stack: err.stack ?? "",
						traceId,
					});
					return {
						traceId,
					};
				}
				return {
					traceId: "",
				};
			},
		},

		//default logger
		info: ({ message, prepend }) => {
			const type = "[info]";
			consoleLog(
				state,
				"log",
				`${prependType(type)}${chalk.bold.blue(type)}${prependPrepend(prepend)} ${chalk.bold.whiteBright(message)}`,
			);
		},
		error: ({ message, traceId, code, prepend }) => {
			const type = "[error]";
			consoleLog(
				state,
				"error",
				`${prependType(type)}${chalk.bold.red(type)}${prependPrepend(prepend)} ${chalk.bold.whiteBright(message)}${code ? chalk.bold.gray(` (code: ${code.toString()})`) : ""}${traceId ? chalk.bold.gray(` (traceId: ${traceId})`) : ""}`,
			);
		},
		warn: ({ message, prepend }) => {
			const type = "[warning]";
			consoleLog(
				state,
				"warn",
				`${prependType(type)}${chalk.bold.yellow(type)}${prependPrepend(prepend)} ${chalk.bold.whiteBright(message)}`,
			);
		},
		debug: ({ message, prepend }) => {
			const type = "[debug]";
			consoleLog(
				state,
				"debug",
				`${prependType(type)}${chalk.bold.gray(type)}${prependPrepend(prepend)} ${chalk.italic.gray(message)}`,
			);
		},
	};
}

function consoleLog(
	state: ServerState,
	type: "log" | "error" | "warn" | "debug",
	message: string,
) {
	switch (type) {
		case "error":
			if (state.logger.silent) {
				return;
			}
			console.error(message);
			break;
		case "warn":
			if (state.logger.silent) {
				return;
			}
			console.warn(message);
			break;
		case "debug":
			if (state.logger.silent) {
				return;
			}
			console.debug(message);
			break;
		case "log":
		default:
			if (state.logger.silent) {
				return;
			}
			console.log(message);
	}
}

function prependType(type: string) {
	return padLeft(type);
}

function prependPrepend(prepend?: string) {
	if (!prepend) {
		return "";
	}
	const t = `[${prepend}]`;
	return ` ${prependType(t)}${chalk.italic.white(t)}`;
}

function padLeft(str: string) {
	return " ".repeat(Math.max(0, 20 - str.length));
}
