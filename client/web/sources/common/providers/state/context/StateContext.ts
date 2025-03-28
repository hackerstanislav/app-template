import { Dispatch, SetStateAction, createContext } from "react";

import { State, create } from "../../../state";

interface StateContextType {
	state: State;
	setState: Dispatch<SetStateAction<State>>;
}

export const StateContext = createContext<StateContextType>({
	state: create(),
	setState: () => void 0,
});
