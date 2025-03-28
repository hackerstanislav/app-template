export type GlobalContext = NonNullable<{
	ENVIRONMENT: "development" | "production" | "testing" | undefined;
}>;

export function env(): GlobalContext {
	if (typeof globalThis !== "undefined") {
		return globalThis as unknown as GlobalContext;
	}
	if (typeof window !== "undefined") {
		return window as unknown as GlobalContext;
	}
	if (typeof global !== "undefined") {
		return global as unknown as GlobalContext;
	}
	if (typeof self !== "undefined") {
		return self as unknown as GlobalContext;
	}
	throw new Error("unable to locate global object");
}

// NOTE: This function is used to setup the environment variables
// It is used to set the environment variables for the application
// This function is called in the beginning of the application

export function setupEnv() {
	const global = env();
	global.ENVIRONMENT = import.meta.env.MODE as GlobalContext["ENVIRONMENT"];
	console.info(`Environment: ${global.ENVIRONMENT ?? "unknown"}`);
}
