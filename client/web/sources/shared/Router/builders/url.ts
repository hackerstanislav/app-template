import { RouteDefinition } from "../types";

export function buildUrl<T extends object>(
	route: RouteDefinition<T>,
	params?: RouteDefinition<T>["vars"],
): string {
	return Object.keys(params ?? {}).reduce((acc, key) => {
		return acc.replace(
			`:${key}`,
			String((params as Record<string, string>)[key]),
		);
	}, route.url);
}
