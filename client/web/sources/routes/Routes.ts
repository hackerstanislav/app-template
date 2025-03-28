import { RouteDefinition } from "../common/router";

/**
 * Routes
 *
 * There are list of all routes in the application. Basic route is home route and its
 * defined in the routes object. All other routes are defined in the DefinedRoutes object
 * here in this file.
 */
export const DefinedRoutes: Record<
	string,
	RouteDefinition<NonNullable<unknown>>
> = {};
