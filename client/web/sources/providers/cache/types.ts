export interface ContextType {
	getCache: <T = unknown>(key: string) => T | undefined;
	setCache: <T = unknown>(key: string, value: T, ttl?: number) => void;
	clearCache: () => void;
	deleteCache: (key: string) => void;
}

export interface CacheBody<T> {
	expiry: Date;
	data: T;
}
