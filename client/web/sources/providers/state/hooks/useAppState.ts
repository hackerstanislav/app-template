import { useContext } from "react";

import { StateContext } from "../context/StateContext";

export function useAppState() {
	return useContext(StateContext);
}
