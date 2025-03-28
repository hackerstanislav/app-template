import { useCallback, useContext } from "react";

import { TelemetryContext } from "../context/TelemetryContext";
import { TelemetryMessage } from "../types";

export function useMessages() {
	const telemetry = useContext(TelemetryContext);

	return useCallback(
		(message: TelemetryMessage) => {
			// If telemetry is not enabled, do not push messages
			if (!telemetry.state?.current.enabled) {
				return;
			}

			telemetry.state.current.messages.push({
				...message,
				id: generateId(),
			});
		},
		[telemetry],
	);
}

function generateId() {
	return `${Date.now().toString()}-${Math.random().toString(36).slice(2)}`;
}
