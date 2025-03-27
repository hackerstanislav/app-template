import { useEffect, useMemo } from "react";
import { match, useLocation, useRouteMatch } from "react-router-dom";

import { RouteDefinition } from "../../../shared";

export function useRoute<T extends object>(
	route: RouteDefinition<T>,
	updater: (params: match<T> | null) => void,
) {
	const routerMatch = useLocationMatch(route);

	useEffect(() => {
		updater(routerMatch);
	}, [routerMatch, updater]);
}

function useLocationMatch<T extends object>(
	route: RouteDefinition<T>,
): match<RouteDefinition<T>["vars"]> | null {
	const location = useLocation();
	const routerMatch = useRouteMatch<RouteDefinition<T>["vars"]>({
		path: route.url,
		exact: route.exact,
	});

	const { url, isExact, params, path } = routerMatch ?? {};
	return useMemo(
		() =>
			url
				? ({ url, isExact, path, params } as match<RouteDefinition<T>["vars"]>)
				: null,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[location],
	);
}
