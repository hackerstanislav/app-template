import { useContext, useMemo } from "react";

import { CookiesContext } from "../context/CookiesContext";
import { CookiesContextData } from "../types";

export function useCookiesState(): CookiesContextData {
	const context = useContext(CookiesContext);

	return useMemo(() => {
		return {
			approved: context.state.approved,
			telemetry: context.state.telemetryApproved,
			trackingId: context.state.telemetryTrackId,
		};
	}, [
		context.state.approved,
		context.state.telemetryApproved,
		context.state.telemetryTrackId,
	]);
}
