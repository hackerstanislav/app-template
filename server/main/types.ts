export interface ServerOptions {
	cwd: string;
	port: number;
	host?: string;
	logger?: {
		database?: string;
		silent?: boolean;
	};
	version: string;
	deployment: "alpha" | "beta" | "production";
	staticFolder: string;
	sessions?: {
		database?: string;
		ttl?: number;
		secrets?: string | string[];
		secure?: boolean;
	};
	store?: {
		database?: string;
	};
	kinde?: {
		domain: string;
		clientId: string;
		clientSecret: string;
		redirectURL: string;
		logoutURL: string;
	};
}

export interface ServerHandlers {
	onStarted?: () => void;
}

export interface ServerReturn {
	dispose: () => Promise<void>;
}
