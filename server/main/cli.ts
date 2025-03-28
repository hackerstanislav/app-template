import { envfull, EnvfullVars } from "envfull";
import fs from "node:fs";
import dotenv from "dotenv";
import path from "node:path";
import Process = NodeJS.Process;

export interface CliArguments {
	cwd?: string;
	env?: string;
	version?: string;
	deployment?: "alpha" | "beta" | "production";
	staticFolder?: string;
	KINDE?: {
		domain?: string;
		clientId?: string;
		clientSecret?: string;
		redirectURL?: string;
		logoutURL?: string;
	};
	APP?: {
		host?: string;
		staticFolder?: string;
		logger?: string;
		sessions?: string;
		store?: string;
		secret?: string;
		secure?: boolean;
		version?: string;
		deployment?: "alpha" | "beta" | "production";
	};
}

export interface CliProps {
	cwd: string;
	env: string;
	commands: "start"[];
	port: number;
	host: string;
	staticFolder: string;
	version: string;
	deployment: "alpha" | "beta" | "production";
	kinde: {
		domain: string;
		clientId: string;
		clientSecret: string;
		redirectURL: string;
		logoutURL: string;
	};
	database: {
		logger: string;
		sessions: string;
		store: string;
	};
	secret: string;
	secure: boolean;
}

export function get(process: Process): CliProps {
	const data: EnvfullVars<CliArguments> = envfull<CliArguments>(process, {
		env: [/APP\.[A-Za-z0-9]/, /KINDE\.[A-Za-z0-9]/],
		arrays: [],
		defaults: {
			cwd: process.cwd(),
			env: ".env",
			staticFolder: path.join(process.cwd(), "public"),
			KINDE: {
				domain: undefined,
				clientId: undefined,
				clientSecret: undefined,
				redirectURL: undefined,
				logoutURL: undefined,
			},
			APP: {
				host: "http://localhost",
				version: "unknown",
				deployment: "alpha",
				secret: undefined,
				secure: false,
				logger: undefined,
				sessions: undefined,
				store: undefined,
				staticFolder: undefined,
			},
		},
		aliases: {
			staticFolder: ["APP.staticFolder"],
			type: ["APP.type"],
			version: ["APP.version"],
		},
	})(path.join(process.cwd(), ".app.json"));

	const {
		cwd,
		host,
		staticFolder,
		kinde,
		secret,
		secure,
		database,
		env,
		version,
		deployment,
	} = parseArguments(data.$ as Required<EnvfullVars<CliArguments>["$"]>);
	const { commands, port } = parseCommands(data._);

	return {
		cwd,
		staticFolder,
		version,
		deployment,
		host,
		port,
		commands,
		kinde,
		secret,
		secure,
		database,
		env,
	};
}

function parseCommands(data: EnvfullVars<CliArguments>["_"]) {
	const commands: CliProps["commands"] = [];
	let port = 80;

	data.forEach((item) => {
		if (item && item.toString().toLowerCase() === "start") {
			commands.push("start");
		}
		if (item && parseInt(item.toString())) {
			port = parseInt(item.toString());
		}
	});

	return {
		commands,
		port,
	};
}

function parseArguments(
	dt: Required<EnvfullVars<CliArguments>["$"]>,
): Pick<CliProps, Exclude<keyof CliProps, "commands" | "port">> {
	const data = parseEnvironment(dt);

	return {
		cwd: data.cwd,
		env: data.env,
		host: data.APP.host ?? "http://localhost",
		staticFolder: data.APP.staticFolder ?? data.staticFolder,
		version: data.APP.version ?? data.version,
		deployment: data.APP.deployment ?? data.deployment,
		kinde: {
			domain: data.KINDE.domain ?? "",
			clientId: data.KINDE.clientId ?? "",
			clientSecret: data.KINDE.clientSecret ?? "",
			redirectURL:
				data.KINDE.redirectURL ?? "http://localhost:5173/auth/kinde/callback",
			logoutURL: data.KINDE.logoutURL ?? "http://localhost:5173",
		},
		database: {
			logger: data.APP.logger ?? "mongodb://127.0.0.1:27001/app-logger",
			sessions: data.APP.sessions ?? "mongodb://127.0.0.1:27001/app-sessions",
			store: data.APP.store ?? "mongodb://127.0.0.1:27001/app-data",
		},
		secret: data.APP.secret ?? "ade8bd55-0d42-468e-bcba-631c3b2f6895",
		secure: data.APP.secure ?? false,
	};
}

function parseEnvironment(
	data: Required<EnvfullVars<CliArguments>["$"]>,
): Required<EnvfullVars<CliArguments>["$"]> {
	if (data.env) {
		try {
			const file = fs.readFileSync(path.join(data.cwd, data.env), "utf8");
			const content = dotenv.parse(file);

			return {
				...data,
				KINDE: {
					...data.KINDE,
					domain: content.KINDE_DOMAIN || data.KINDE.domain,
					clientId: content.KINDE_CLIENT_ID || data.KINDE.clientId,
					clientSecret: content.KINDE_CLIENT_SECRET || data.KINDE.clientSecret,
					redirectURL: content.KINDE_REDIRECT_URL || data.KINDE.redirectURL,
					logoutURL: content.KINDE_LOGOUT_URL || data.KINDE.logoutURL,
				},
				APP: {
					...data.APP,
					host: content.APP_HOST || data.APP.host,
					staticFolder: content.APP_STATIC_FOLDER || data.APP.staticFolder,
					logger: content.APP_LOGGER || data.APP.logger,
					sessions: content.APP_SESSIONS || data.APP.sessions,
					store: content.APP_STORE || data.APP.store,
					secret: content.APP_SECRET || data.APP.secret,
					secure: !!content.APP_SECURE || data.APP.secure,
					version: content.APP_VERSION || data.APP.version,
					deployment: (content.APP_DEPLOYMENT ||
						data.APP.deployment) as Required<CliArguments>["APP"]["deployment"],
				},
			};
		} catch (error) {
			return data;
		}
	}

	return data;
}
