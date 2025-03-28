export type ErrorStatus = 400 | 401 | 403 | 404 | 500 | 503;

export interface UnexpectedError {
	message: string;
	status: number;
	code: number;
	traceId?: string;
}

export interface LoginApiKey {
	id?: string;
	name: string;
	validUntil: Date;
	token: string;
}

export interface LoginData {
	id?: string;
	name: string;
	surname: string;
	email: string;
	handles: string[];
	picture?: string | null;
	type?: "kinde" | "token";
	apiKeys?: LoginApiKey[];
}
