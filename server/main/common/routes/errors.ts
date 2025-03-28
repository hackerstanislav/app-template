import { ErrorRequestHandler, Express, Request } from "express";
import { InputValidationError } from "openapi-validator-middleware";

import { ServerState } from "../state";

import { UnexpectedError, ErrorStatus } from "./types";

export function handlerErrors(app: Express, state: ServerState) {
	app.all("*", (req, res) => {
		return res.sendStatus(404);
	});
	app.use(clientErrorHandler());
	app.use(defaultErrorHandler(state));
}

function clientErrorHandler(): ErrorRequestHandler {
	return (err, req, res, next) => {
		if (req.xhr) {
			res.status(500);
		} else {
			next(err);
		}
	};
}

function defaultErrorHandler(state: ServerState): ErrorRequestHandler {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-misused-promises
	return async (err: UnexpectedError | Error, req, res, _) => {
		//some errors are not instances of Error
		if (err instanceof Error) {
			res.status(500).json(await processError(req, state, err));
		} else {
			// process our http error
			res
				.status(err.status)
				.json(await processUnexpectedError(req, state, err));
		}
	};
}

async function processUnexpectedError(
	req: Request,
	state: ServerState,
	err: UnexpectedError,
) {
	//use only internal errors into log
	if (err.status < 500) {
		return err;
	}
	//no logger
	if (!state.logger.logger) {
		return err;
	}

	const { traceId } = await state.logger.logger.rest.error(err);
	return {
		...err,
		traceId,
	};
}

async function processError(
	req: Request,
	state: ServerState,
	err: Error & Partial<InputValidationError>,
) {
	const errors = err.errors?.map((error) => {
		if (typeof error === "string") {
			return error;
		}
		return error.message;
	});
	const error = errors?.length
		? ({
				message: `Internal Server Error: ${err.message} => ${errors.join(", ")}`,
				code: 0,
				status: 500,
			} as UnexpectedError)
		: ({
				message: `Internal Server Error: ${err.message}`,
				code: 0,
				status: 500,
			} as UnexpectedError);

	//no logger
	if (!state.logger.logger) {
		return error;
	}

	// do not validate invalid requests
	if (err instanceof InputValidationError) {
		return err;
	}

	const { traceId } = await state.logger.logger.rest.fatal(err);
	return {
		...error,
		traceId,
	};
}

export function createHttpError(
	message: string,
	status: ErrorStatus = 500,
	code = 0,
	traceId?: string,
): UnexpectedError {
	return {
		status,
		message,
		code,
		traceId,
	};
}
