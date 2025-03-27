import { ReactNode, useCallback, useRef } from "react";

import { CacheBody } from "../types";

import { CacheContext } from "./CacheContext";

export function CacheProvider({ children }: { children: ReactNode }) {
	const cacheItems = useRef<Record<string, CacheBody<unknown> | undefined>>({});

	const getCache = useCallback(<T = unknown,>(key: string) => {
		const cacheValue = cacheItems.current[key];

		// If cache value is not found, return undefined
		if (!cacheValue) {
			return undefined;
		}

		// If cache value is expired, delete it and return undefined
		if (isExpired(cacheValue)) {
			cacheItems.current[key] = undefined;
			return undefined;
		}

		// Otherwise, return the cache value
		return cacheValue.data as T;
	}, []);

	const setCache = useCallback(
		<T = unknown,>(key: string, value: T, ttl = 10) => {
			cacheItems.current[key] = {
				expiry: getExpired(ttl),
				data: value,
			};
		},
		[],
	);

	const clearCache = useCallback(() => {
		cacheItems.current = {};
	}, []);

	const deleteCache = useCallback((key: string) => {
		cacheItems.current[key] = undefined;
	}, []);

	return (
		<CacheContext.Provider
			value={{ getCache, setCache, clearCache, deleteCache }}
		>
			{children}
		</CacheContext.Provider>
	);
}

function isExpired(cacheValue: CacheBody<unknown>) {
	return new Date().getTime() > cacheValue.expiry.getTime();
}

function getExpired(ttl: number) {
	const t = new Date();
	t.setSeconds(t.getSeconds() + ttl);
	return t;
}
