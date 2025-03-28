import { useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import { TelemetryMessageTracked, TelemetryServiceProvider } from "../types";

const GTAG: Gtag.Gtag = gtag;
const IS_GTAG = typeof GTAG === "function";

const GTAG_ID = import.meta.env.VITE_GA_ID as string;

function GoogleAnalyticsFn({
	enabled,
	children,
}: Parameters<TelemetryServiceProvider>[0]) {
	// Enable or disable Google Analytics
	useEnabled(enabled);
	// Send telemetry messages
	const onSend = useSend();

	return <>{children(onSend)}</>;
}

GoogleAnalyticsFn.propTypes = {
	children: PropTypes.func,
};

export const GoogleAnalytics: TelemetryServiceProvider = GoogleAnalyticsFn;

//hooks

const GTAG_DEFAULTS: Gtag.ConsentParams = {
	ad_storage: "denied",
	ad_user_data: "denied",
	ad_personalization: "denied",
	analytics_storage: "denied",
	functionality_storage: "denied",
	personalization_storage: "denied",
	security_storage: "denied",
};

const GTAG_GRANTED: Gtag.ConsentParams = {
	ad_storage: "granted",
	ad_user_data: "granted",
	ad_personalization: "granted",
	analytics_storage: "granted",
	functionality_storage: "granted",
	personalization_storage: "granted",
	security_storage: "granted",
};

function useEnabled(enabled: boolean) {
	useEffect(() => {
		if (!IS_GTAG) {
			console.warn("Google Analytics is not available");
			return;
		}
		GTAG("js", new Date());
		GTAG("config", GTAG_ID);
	}, []);

	useEffect(() => {
		if (!IS_GTAG) {
			console.warn("Google Analytics is not available");
			return;
		}
		if (enabled) {
			GTAG("consent", "update", GTAG_GRANTED);
		} else {
			GTAG("consent", "update", GTAG_DEFAULTS);
		}
	}, [enabled]);
}

function useSend() {
	return useCallback(async (messages: TelemetryMessageTracked[]) => {
		const events = createGAEvents(messages);
		events.forEach(({ name, parameters }) => {
			GTAG("event", name, parameters);
		});
		return Promise.resolve();
	}, []);
}

//messages

function createGAEvents(messages: TelemetryMessageTracked[]) {
	return messages.map((message) => {
		return {
			name: createName(message),
			parameters: {
				trackId: message.trackId,
				contextId: message.contextId,
				...message.params,
				...(message.error ? { error: stringifyError(message.error) } : {}),
			},
		};
	});
}

function createName(message: TelemetryMessageTracked) {
	return [message.category, message.subcategory, message.action]
		.filter(Boolean)
		.join("_");
}

function stringifyError(error: unknown) {
	if (error instanceof Error) {
		return error.message;
	}
	try {
		return JSON.stringify(error);
	} catch (e) {
		return String(error);
	}
}
