import * as React from "react";
import { useState } from "react";

import { create } from "../../../state";

import { StateContext } from "./StateContext";

export const StateProvider: React.FC<{ children: React.ReactElement }> = ({
	children,
}) => {
	const [state, setState] = useState(create());

	return (
		<StateContext.Provider value={{ state, setState }}>
			{children}
		</StateContext.Provider>
	);
};
