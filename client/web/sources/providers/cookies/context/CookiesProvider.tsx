import * as React from "react";
import { useCallback, useState } from "react";

import { getCookieState, setCookieState } from "../handlers";
import { CookieBanner } from "../dialog/CookieBanner";
import { CookiesContextData } from "../types";

import { CookiesContext } from "./CookiesContext";

export const CookiesProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [state, setState] = useState(getCookieState());

	const onApprove = useCallback(
		(data: CookiesContextData) => {
			const telemetryTrackId =
				data.approved && data.telemetry
					? `${Date.now().toString()}-${Math.random().toString(36).slice(2)}`
					: null;

			setCookieState({
				...state,
				approved: data.approved,
				telemetryApproved: data.telemetry,
				telemetryTrackId,
			});
			setState({
				...state,
				approved: data.approved,
				telemetryApproved: data.telemetry,
				telemetryTrackId,
			});
		},
		[state, setState],
	);

	return (
		<CookiesContext.Provider
			value={{
				state,
				onApprove,
			}}
		>
			{children}
			<CookieBanner onApproved={onApprove} onRejectOptional={onApprove} />
		</CookiesContext.Provider>
	);
};
