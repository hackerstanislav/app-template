import { createContext, MutableRefObject } from "react";

import { TelemetryState } from "../types";

export interface TelemetryContextType {
	state: MutableRefObject<TelemetryState> | null;
}

export const TelemetryContext = createContext<TelemetryContextType>({
	state: null,
});
