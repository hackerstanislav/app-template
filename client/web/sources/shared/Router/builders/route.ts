import { RouteDefinition } from "../types";

export function buildRoute<T extends object>(
	url: string,
	exact: boolean,
	vars: T = {} as T,
): RouteDefinition<T> {
	return {
		url,
		vars,
		exact,
	};
}
