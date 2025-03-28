export interface CookiesContextData {
	approved: boolean;
	telemetry: boolean;
	trackingId: string | null;
}

export interface CookiesContextState {
	//consent data
	approved: boolean;
	telemetryApproved: boolean;
	telemetryTrackId: string | null;
}

export interface CookiesContextHandlers {
	onApprove: (data: CookiesContextData) => void;
}
