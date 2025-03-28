import { createContext } from "react";

import { CookiesContextHandlers, CookiesContextState } from "../types";

export const CookiesContext = createContext<
	{
		state: CookiesContextState;
	} & CookiesContextHandlers
>({
	state: {
		approved: false,
		telemetryApproved: false,
		telemetryTrackId: null,
	},
	onApprove: () => void 0,
});
