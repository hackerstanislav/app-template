import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { NoopAnalytics } from "../services/NoopAnalytics";
import { useSending } from "../hooks/useSending";
import { useCookiesState } from "../../cookies";
import { env } from "../../../env";
import {
	TelemetryMessageTracked,
	TelemetryServiceProvider,
	TelemetryState,
} from "../types";

import { TelemetryContext } from "./TelemetryContext";

export const TelemetryProvider: React.FC<{
	Provider: TelemetryServiceProvider;
	children: React.ReactNode;
	debounce?: number;
}> = ({ children, Provider, debounce }) => {
	const cookies = useCookiesState();
	const state = useRef<TelemetryState>({
		enabled: cookies.approved && cookies.telemetry,
		trackId: cookies.trackingId,
		messages: [],
		sending: false,
	});
	const [enabled, setEnabled] = useState(state.current.enabled);

	// Update state on cookies change
	useEffect(() => {
		state.current.messages = [];
		state.current.sending = false;
		state.current.enabled = cookies.approved && cookies.telemetry;
		state.current.trackId = cookies.trackingId;
		setEnabled(state.current.enabled);
	}, [cookies.approved, cookies.telemetry, cookies.trackingId, setEnabled]);

	const Comp = useMemo(() => {
		if (env().ENVIRONMENT !== "production") {
			console.warn(
				"TelemetryProvider is disabled in non-production environment",
			);
			return NoopAnalytics;
		}
		return Provider;
	}, [Provider]);

	return (
		<TelemetryContext.Provider value={{ state }}>
			<Comp enabled={enabled}>
				{(onSend) => (
					<TelemetryChildren onSend={onSend} debounce={debounce}>
						{children}
					</TelemetryChildren>
				)}
			</Comp>
		</TelemetryContext.Provider>
	);
};

function TelemetryChildren({
	onSend,
	children,
	debounce,
}: {
	onSend: (messages: TelemetryMessageTracked[]) => Promise<void>;
	children: React.ReactNode;
	debounce?: number;
}) {
	useSending(onSend, debounce);

	return <>{children}</>;
}
