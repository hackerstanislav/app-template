import { useCallback } from "react";
import PropTypes from "prop-types";

import { TelemetryServiceProvider } from "../types";

function NoopFn({ children }: Parameters<TelemetryServiceProvider>[0]) {
	// Send telemetry messages
	const onSend = useCallback(() => Promise.resolve(), []);

	return <>{children(onSend)}</>;
}

NoopFn.propTypes = {
	children: PropTypes.func,
};

export const NoopAnalytics: TelemetryServiceProvider = NoopFn;
