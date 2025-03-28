import Cookies from "js-cookie";

import { CookiesContextState } from "./types";

const SYSTEM_PREFIX = "_system_";
const TELEMETRY_PREFIX = "_telemetry_";

const COOKIE_EXPIRATION_DAYS = 365;

export function getCookieState(): CookiesContextState {
	return {
		approved: cookiesApproved().get(),
		telemetryApproved: telemetryApproved().get(),
		telemetryTrackId: telemetryTrackId().get() ?? null,
	};
}

export function setCookieState(state: CookiesContextState) {
	cookiesApproved().set(state.approved);
	telemetryApproved().set(state.telemetryApproved);
	if (state.telemetryTrackId === null) {
		telemetryTrackId().delete();
	} else {
		telemetryTrackId().set(state.telemetryTrackId);
	}
}

//getters

function cookiesApproved() {
	return {
		get: () => Cookies.get(`${SYSTEM_PREFIX}_cookies_approved`) === "true",
		set: (value: boolean) =>
			Cookies.set(`${SYSTEM_PREFIX}_cookies_approved`, value.toString(), {
				expires: COOKIE_EXPIRATION_DAYS,
			}),
	};
}

function telemetryApproved() {
	return {
		get: () => Cookies.get(`${TELEMETRY_PREFIX}_cookies_approved`) === "true",
		set: (value: boolean) =>
			Cookies.set(`${TELEMETRY_PREFIX}_cookies_approved`, value.toString(), {
				expires: COOKIE_EXPIRATION_DAYS,
			}),
	};
}

function telemetryTrackId() {
	return {
		get: () => Cookies.get(`${TELEMETRY_PREFIX}_track_id`),
		set: (value: string) =>
			Cookies.set(`${TELEMETRY_PREFIX}_track_id`, value, {
				expires: COOKIE_EXPIRATION_DAYS,
			}),
		delete: () => {
			Cookies.remove(`${TELEMETRY_PREFIX}_track_id`);
		},
	};
}
