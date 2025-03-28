import { ReactElement, ReactNode } from "react";

export interface TelemetryState {
	enabled: boolean;
	sending: boolean;
	trackId: string | null;
	messages: TelemetryMessageIdentity[];
}

export interface TelemetryMessageTracked extends TelemetryMessageIdentity {
	date: Date;
	trackId: string;
}

export interface TelemetryMessageIdentity extends TelemetryMessage {
	id: string;
}

export interface TelemetryMessage {
	action:
		| "error"
		| "opened"
		| "canceled"
		| "inserted"
		| "updated"
		| "deleted"
		| "viewed"
		| "clicked"
		| "suggested"
		| "visited";
	category?: string;
	subcategory?: string;
	contextId?: string;
	// eslint-disable-next-line  @typescript-eslint/no-explicit-any
	error?: any;
	params?: TelemetryMessageParams;
}

export interface TelemetryMessageParams {
	archived?: boolean;
	type?: "old" | "new";
}

export type TelemetryEvents<
	// eslint-disable-next-line  @typescript-eslint/no-explicit-any
	K extends Record<string, (...args: any[]) => TelemetryMessage>,
> = {
	[key in keyof K]: (...args: Parameters<K[key]>) => TelemetryMessage;
};

export type TelemetryServiceProvider = (props: {
	enabled: boolean;
	children: (
		onSend: (messages: TelemetryMessageTracked[]) => Promise<void>,
	) => ReactNode;
}) => ReactElement;
