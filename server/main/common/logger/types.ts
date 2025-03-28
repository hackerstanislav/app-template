import { ServerState } from "../state";

export interface LoggerMessage {
	message: string;
	prepend?: string;
}

export type LoggerCustomMessage<T> = T;

export interface Logger {
	auth: (
		message: LoggerCustomMessage<{
			kinde: Omit<ServerState["auth"]["kinde"], "instance">;
		}>,
	) => void;
	listening: (message: LoggerCustomMessage<{ port: number }>) => void;
	database: (message: LoggerCustomMessage<{ database: string }>) => void;
	cwd: (message: LoggerCustomMessage<{ cwd: string }>) => void;
	public: (message: LoggerCustomMessage<{ folder: string }>) => void;
	fatal: (
		message: LoggerCustomMessage<
			LoggerMessage & { stack?: string; traceId?: string; code?: number }
		>,
	) => void;
	success: (message: LoggerMessage) => void;

	info: (message: LoggerMessage) => void;
	error: (
		message: LoggerCustomMessage<
			LoggerMessage & { traceId?: string; code?: number }
		>,
	) => void;
	warn: (message: LoggerMessage) => void;
	debug: (message: LoggerMessage) => void;

	rest: {
		error: (
			message: { message: string; code: number },
			opts?: Pick<LoggerMessage, "prepend">,
		) => Promise<{ traceId: string }>;
		fatal: (
			err: Error,
			opts?: Pick<LoggerMessage, "prepend">,
		) => Promise<{ traceId: string }>;
	};
}

export interface LoggerStore {
	error: (message: {
		message: string;
		code?: number;
	}) => Promise<{ traceId: string }>;
	fatal: (err: Error) => Promise<{ traceId: string }>;
}
