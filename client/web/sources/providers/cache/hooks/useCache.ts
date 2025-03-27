import { useContext } from "react";

import { CacheContext } from "../context/CacheContext";

export function useCache() {
	const cache = useContext(CacheContext);

	if (!cache) {
		throw new Error("Hook useCache must be used within a CacheProvider");
	}
	return cache;
}
