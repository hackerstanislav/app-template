import { WithId } from "mongodb";

import { LoginData, LoginApiKey } from "../routes";

export interface AuthStore {
	//auth
	login: (data: LoginData) => Promise<LoginData | null>;
	token: (id: string) => Promise<LoginData | null>;
	profile: (handle: string) => Promise<LoginData | null>;
	//api keys
	apiKey: (logged: LoginData, id: string) => Promise<LoginApiKey | null>;
	apiKeys: (logged: LoginData) => Promise<LoginApiKey[]>;
	createApiKey: (
		logged: LoginData,
		key: LoginApiKey,
	) => Promise<LoginApiKey | null>;
	deleteApiKey: (logged: LoginData, id: string) => Promise<LoginApiKey | null>;
}

export type SavedLoggedApiKey = WithId<Omit<LoginApiKey, "id">>;

export type SavedLoggedData = WithId<Omit<LoginData, "id" | "apiKeys">> & {
	apiKeys?: SavedLoggedApiKey[];
};
export type InsertLoggedData = Omit<LoginData, "id">;
