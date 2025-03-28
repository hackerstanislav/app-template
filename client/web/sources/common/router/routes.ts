import { DefinedRoutes } from "../../routes";

import { buildRoute } from "./builders";

export const Routes = {
	"/": buildRoute("/", true, {}),
	...DefinedRoutes,
};
