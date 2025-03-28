import { useCallback } from "react";

import { State, StateEdit } from "../../../state";

import { useAppState } from "./useAppState";

export function usePageState(): StateEdit<State["page"]> {
	const { state, setState } = useAppState();

	return [
		state.page,
		useCallback(
			(page) => {
				setState((state) => ({
					...state,
					page,
				}));
			},
			[setState],
		),
	];
}
