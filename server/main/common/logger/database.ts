import { Db, MongoClient } from "mongodb";
import crypto from "crypto";

import { LoggerStore } from "./types";

const LOGGER_FATAL_COLLECTION = "errors.fatal";
const LOGGER_ERROR_COLLECTION = "errors.unexpected";

export interface MongoLoggerOpts {
	uri: string;
}

export function connectDatabaseLogger(
	opts: MongoLoggerOpts,
): Promise<LoggerStore> {
	return new Promise((resolve, reject) => {
		MongoClient.connect(opts.uri, {})
			.then((client) => {
				const db = client.db();
				const store = {} as LoggerStore;

				store.fatal = storeFatal(db);
				store.error = storeError(db);

				resolve(store);
			})
			.catch((e: unknown) => {
				reject(e as Error);
			});
	});
}

function storeFatal(db: Db) {
	const collection = db.collection(LOGGER_FATAL_COLLECTION);

	return async function (p1: Error) {
		const traceId = crypto.randomBytes(16).toString("hex");

		await collection.insertOne({
			message: p1.message,
			stack: p1.stack,
			traceId,
		});

		return { traceId };
	};
}

function storeError(db: Db) {
	const collection = db.collection(LOGGER_ERROR_COLLECTION);

	return async function (p1: { message: string; code?: number }) {
		const traceId = crypto.randomBytes(16).toString("hex");

		await collection.insertOne({
			message: p1.message,
			code: p1.code,
			traceId,
		});

		return { traceId };
	};
}
