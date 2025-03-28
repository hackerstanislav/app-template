import { useCallback } from "react";
import { useHistory } from "react-router";

import { RouteDefinition, buildUrl } from "../../../router";

export function useDoNavigate<T extends object>(
	route: RouteDefinition<T>,
	params: RouteDefinition<T>["vars"],
	enabled = true,
): [() => void, boolean] {
	const history = useHistory();

	const handler = useCallback(() => {
		if (enabled) {
			history.push(buildUrl(route, params));
		}
	}, [history, enabled, route, params]);

	return [handler, enabled];
}

export function useOnNavigate<T extends object>() {
	const history = useHistory();

	return useCallback(
		(
			route: RouteDefinition<T>,
			params: RouteDefinition<T>["vars"] | undefined,
			enabled = true,
		) => {
			if (enabled) {
				history.push(buildUrl(route, params));
			}
		},
		[history],
	);
}
