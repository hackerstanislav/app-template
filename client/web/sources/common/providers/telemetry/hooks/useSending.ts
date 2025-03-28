import { MutableRefObject, useContext, useEffect } from "react";

import { TelemetryContext } from "../context/TelemetryContext";
import { TelemetryMessageTracked, TelemetryState } from "../types";

export function useSending(
	onSend: (messages: TelemetryMessageTracked[]) => Promise<void>,
	debounce = 10000,
) {
	const telemetry = useContext(TelemetryContext);

	//Window visibility change sending
	useEffect(() => {
		// If telemetry is not enabled, do not send data
		if (!telemetry.state?.current.enabled) {
			return;
		}

		const handler = () => {
			if (document.visibilityState === "hidden") {
				sendData(telemetry.state, onSend, true);
			}
		};

		document.addEventListener("visibilitychange", handler);
		return () => {
			document.removeEventListener("visibilitychange", handler);
		};
	}, [onSend, telemetry.state, telemetry.state?.current.enabled]);

	// Timer sending
	useEffect(() => {
		// If telemetry is not enabled, do not send data
		if (!telemetry.state?.current.enabled) {
			return;
		}

		const timer = window.setInterval(() => {
			sendData(telemetry.state, onSend);
		}, debounce);
		return () => {
			window.clearInterval(timer);
		};
	}, [onSend, telemetry.state, telemetry.state?.current.enabled, debounce]);
}

function sendData(
	st: MutableRefObject<TelemetryState> | null,
	onSend: (messages: TelemetryMessageTracked[]) => Promise<void>,
	forceSend = false,
) {
	const state = st?.current;
	const messages = state?.messages ?? [];
	const trackId = state?.trackId ?? null;

	// No messages to send or no trackId
	if (messages.length === 0 || trackId === null || !state) {
		return;
	}

	// Already sending, wait for next interval
	if (state.sending && !forceSend) {
		return;
	}

	const current = messages.slice();
	const send = current.map(
		(message) =>
			({
				...message,
				trackId,
				date: new Date(),
			}) as TelemetryMessageTracked,
	);

	state.sending = true;
	state.messages = [];

	onSend(send)
		.then(() => {
			state.sending = false;
		})
		.catch(() => {
			state.messages.unshift(...current);
			state.sending = false;
		});
}
