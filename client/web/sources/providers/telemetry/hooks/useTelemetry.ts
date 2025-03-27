import { useMemo } from "react";

import { TelemetryEvents } from "../types";

import { useMessages } from "./useMessages";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function useTelemetry<T extends TelemetryEvents<any>>(events: T): T {
	const insertMessage = useMessages();

	return useMemo(() => {
		return Object.keys(events).reduce<Record<string, () => void>>(
			(acc, key) => {
				// eslint-disable-next-line  @typescript-eslint/no-explicit-any
				acc[key] = (...args: any[]) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					const event = events[key](...args);
					insertMessage(event);
				};
				return acc;
			},
			{},
		) as T;
	}, [insertMessage, events]);
}
