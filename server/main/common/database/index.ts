import { Db, MongoClient } from "mongodb";

import { AuthStore } from "./types";
import { authStore } from "./auth";

export * from "./types";

export interface MongoStoreOpts<DS> {
	uri: string;
	create: (db: Db) => DS;
}

export function connectDatabaseStore<DS>(
	opts: MongoStoreOpts<DS>,
): Promise<{ store: DS; auth: AuthStore }> {
	return new Promise((resolve, reject) => {
		MongoClient.connect(opts.uri, {})
			.then((client) => {
				const db = client.db();
				resolve({
					store: opts.create(db),
					auth: authStore(db),
				});
			})
			.catch((e: unknown) => {
				reject(e as Error);
			});
	});
}
