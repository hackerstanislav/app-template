import * as React from "react";
import { useCallback } from "react";
import { HashRouter } from "react-router-dom";

import { useRoutes } from "../../../../routes";
import { usePageState } from "../../state";
import { useRoute } from "../hooks";
import { Routes } from "../../../router";

export const RouterProvider: React.FC<{ children: React.ReactElement }> = ({
	children,
}) => {
	return (
		<HashRouter>
			<Router>{children}</Router>
		</HashRouter>
	);
};

const Router: React.FC<{ children: React.ReactElement }> = ({ children }) => {
	const [, setPage] = usePageState();

	//home route
	useRoute(
		Routes["/"],
		useCallback(
			(match) => {
				if (match?.isExact) {
					setPage("home");
				}
			},
			[setPage],
		),
	);
	//defined routes
	useRoutes();

	return <>{children}</>;
};
