import { Collection, Db, ObjectId } from "mongodb";

import { LoginApiKey, LoginData } from "../routes";

import {
	AuthStore,
	InsertLoggedData,
	SavedLoggedApiKey,
	SavedLoggedData,
} from "./types";
import { comparePassword, generateKey } from "./crypto";

export const COLLECTIONS_AUTH = "auth";

export function authStore(db: Db): AuthStore {
	return {
		//auth
		login: async (data) => login(db, data),
		token: async (tkn) => token(db, tkn),
		profile: async (handle) => profile(db, handle),
		//api keys
		apiKeys: async (logged) => apiKeys(db, logged),
		apiKey: async (logged, keyId) => apiKey(db, logged, keyId),
		createApiKey: async (logged, key) => createApiKey(db, logged, key),
		deleteApiKey: async (logged, keyId) => deleteApiKey(db, logged, keyId),
	};
}

//HANDLERS

async function login(db: Db, data: LoginData): Promise<LoginData | null> {
	const collection = db.collection(COLLECTIONS_AUTH);
	const results = await loginUser(collection, data);

	return results ? transformSavedToLogged(results) : null;
}

async function token(db: Db, tkn: string): Promise<LoginData | null> {
	const collection = db.collection(COLLECTIONS_AUTH);
	const results = await tokenUser(collection, tkn);

	return results ? transformSavedToLogged(results) : null;
}

async function profile(db: Db, handle: string): Promise<LoginData | null> {
	const collection = db.collection(COLLECTIONS_AUTH);
	const selector = handlesSelect([handle]);
	const results = await collection.findOne<SavedLoggedData>(selector);

	return results ? transformSavedToLogged(results) : null;
}

async function apiKeys(db: Db, logged: LoginData): Promise<LoginApiKey[]> {
	const collection = db.collection(COLLECTIONS_AUTH);
	const selector = idSelector(logged.id ?? "");

	const query = await collection.findOne<SavedLoggedData>(selector);

	if (!query) {
		return [];
	}

	const apiKeys = query.apiKeys ?? [];
	return apiKeys.map((result) => transformSavedKeyToLoggedKey(result));
}

async function apiKey(
	db: Db,
	logged: LoginData,
	keyId: string,
): Promise<LoginApiKey | null> {
	const collection = db.collection(COLLECTIONS_AUTH);
	const selector = idSelector(logged.id ?? "");

	const query = await collection.findOne<SavedLoggedData>(selector);

	if (!query) {
		return null;
	}

	const apiKeys = query.apiKeys ?? [];
	const key = apiKeys.find((key) => key._id.toString() === keyId);

	if (!key) {
		return null;
	}

	return transformSavedKeyToLoggedKey(key);
}

async function createApiKey(db: Db, logged: LoginData, key: LoginApiKey) {
	const collection = db.collection(COLLECTIONS_AUTH);
	const selector = idSelector(logged.id ?? "");

	const query = await collection.findOne<SavedLoggedData>(selector);

	if (!query) {
		return null;
	}

	const { fullKey, token } = await generateKey(logged.id ?? "");

	const keys = query.apiKeys ?? [];
	const newKey = transformLoggedKeyToSavedKey(key, token);
	keys.push(newKey);

	await collection.updateOne(
		selector,
		{
			$set: {
				apiKeys: keys,
			},
		},
		{},
	);

	return transformSavedKeyToLoggedKey(newKey, fullKey);
}

async function deleteApiKey(db: Db, logged: LoginData, keyId: string) {
	const collection = db.collection(COLLECTIONS_AUTH);
	const selector = idSelector(logged.id ?? "");

	const query = await collection.findOne<SavedLoggedData>(selector);

	if (!query) {
		return null;
	}

	const keys = query.apiKeys ?? [];
	const removeKey = keys.find((key) => key._id.toString() === keyId);

	if (!removeKey) {
		return null;
	}

	const apiKeys = keys.filter((key) => key._id.toString() !== keyId);

	await collection.updateOne(
		selector,
		{
			$set: {
				apiKeys,
			},
		},
		{},
	);

	return transformSavedKeyToLoggedKey(removeKey);
}

async function loginUser(collection: Collection, data: LoginData) {
	const selector = handlesSelect(data.handles);
	const results = await collection.findOne<SavedLoggedData>(selector);

	if (results) {
		//update user
		await collection.updateOne(idSelector(results._id.toString()), {
			$set: transformLoginToSaved(data),
		});

		const newSelector = idSelector(results._id.toString());
		return await collection.findOne<SavedLoggedData>(newSelector);
	}

	//insert user
	const insert = transformLoginToSaved(data, data.handles);
	const result = await collection.insertOne(insert);

	const newSelector = idSelector(result.insertedId.toString());
	return await collection.findOne<SavedLoggedData>(newSelector);
}

async function tokenUser(collection: Collection, tkn: string) {
	const [id, token] = Buffer.from(tkn, "base64").toString("ascii").split(".");

	const selector = idSelector(id);
	const query = await collection.findOne<SavedLoggedData>(selector);

	if (!query) {
		return null;
	}

	const keys: LoginApiKey[] = query.apiKeys ?? [];
	for (const key of keys) {
		const end = key.validUntil;

		// check if token is still valid
		if (end >= new Date()) {
			const match = await comparePassword(key.token, token);
			if (match) {
				return query;
			}
		}
	}

	return null;
}

//TRANSFORMS

function transformSavedToLogged(user: SavedLoggedData): LoginData {
	return {
		id: user._id.toString(),
		picture: user.picture,
		email: user.email,
		name: user.name,
		surname: user.surname,
		handles: user.handles,
	};
}

function transformLoginToSaved(
	user: LoginData,
	handles?: string[],
): InsertLoggedData {
	return {
		picture: user.picture,
		email: user.email,
		name: user.name,
		surname: user.surname,
		handles: handles ? [...user.handles, ...handles] : user.handles,
	};
}

function transformSavedKeyToLoggedKey(
	key: SavedLoggedApiKey,
	token?: string,
): LoginApiKey {
	return {
		id: key._id.toString(),
		name: key.name,
		token: token ?? "",
		validUntil: key.validUntil,
	};
}

function transformLoggedKeyToSavedKey(
	key: LoginApiKey,
	token?: string,
): SavedLoggedApiKey {
	return {
		_id: key.id ? new ObjectId(key.id) : new ObjectId(),
		name: key.name,
		token: token ?? "",
		validUntil: key.validUntil,
	};
}

// SELECTORS

function handlesSelect<P>(
	handles: string[],
	partial: NonNullable<unknown> = {},
): NonNullable<P> {
	if (!handles.length) {
		return partial as NonNullable<P>;
	}
	return {
		...partial,
		handles: inSelector(handles),
	} as unknown as NonNullable<P>;
}

function inSelector<P, T = P>(selector: T[]): NonNullable<P> {
	return {
		$in: selector,
	} as unknown as NonNullable<P>;
}

function idSelector(
	id: string,
	partial: Partial<Record<string, NonNullable<unknown>>> = {},
) {
	if (!ObjectId.isValid(id)) {
		return partial;
	}

	return {
		...partial,
		_id: new ObjectId(id),
	};
}
