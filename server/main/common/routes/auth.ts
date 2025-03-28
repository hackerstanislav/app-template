import { SessionManager, UserType } from "@kinde-oss/kinde-typescript-sdk";
import { Express, Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import assert from "node:assert";

import { SessionStore } from "../middlewares";
import { ServerState } from "../state";
import { LoginData } from "./types";

export function routeAuth(app: Express, state: ServerState) {
	const router = Router();

	routeKinde(router, state);
	routeUniversal(router, state);

	return router;
}

export async function handleAuthenticate(state: ServerState, req: Request) {
	assert(req.store, "Store instance is not available.");

	try {
		return (
			(await authenticateKinde(state, req)) ??
			(await authenticateToken(state, req))
		);
	} catch (_) {
		return null;
	}
}

function routeUniversal(router: Router, state: ServerState) {
	router.use(
		"/auth/logout",
		asyncHandler(async (req, res) => {
			const session = req.session as SessionStore;
			let redirectUrl = "/";

			// Logout from Kinde
			if (state.auth.kinde.instance && (await authenticateKinde(state, req))) {
				redirectUrl = (
					await state.auth.kinde.instance.logout(createSessionManager(req))
				).toString();
			}

			session.logged = null;
			res.redirect(redirectUrl);
		}),
	);
}

//KINDE

function routeKinde(router: Router, state: ServerState) {
	// Login
	router.use(
		"/auth/kinde/login",
		asyncHandler(async (req, res) => {
			// Redirect to home if Kinde instance is not available
			if (!state.auth.kinde.instance) {
				res.redirect("/");
				return;
			}

			const loginUrl = await state.auth.kinde.instance.login(
				createSessionManager(req),
			);
			res.redirect(loginUrl.toString());
		}),
	);

	// Register
	router.use(
		"/auth/kinde/register",
		asyncHandler(async (req, res) => {
			// Redirect to home if Kinde instance is not available
			if (!state.auth.kinde.instance) {
				res.redirect("/");
				return;
			}

			const registerUrl = await state.auth.kinde.instance.register(
				createSessionManager(req),
			);
			res.redirect(registerUrl.toString());
		}),
	);

	// Invite
	router.use(
		"/auth/kinde/invite",
		asyncHandler((req, res) => {
			// Redirect to home if Kinde instance is not available
			if (!state.auth.kinde.instance) {
				res.redirect("/");
				return;
			}

			res.redirect(`${state.auth.kinde.domain}/knock-knock`);
		}),
	);

	router.get(
		"/auth/kinde/callback",
		asyncHandler(async (req, res) => {
			const session = req.session as SessionStore;
			const manager = createSessionManager(req);

			// Redirect to home if Kinde instance is not available
			if (!state.auth.kinde.instance) {
				res.redirect("/");
				return;
			}

			const url = new URL(
				`${req.protocol}://${req.get("host") ?? ""}${req.url}`,
			);
			await state.auth.kinde.instance.handleRedirectToApp(manager, url);

			const profile = await state.auth.kinde.instance.getUserProfile(manager);
			const result = await loginKinde(req, res, profile);

			if (!result) {
				res.redirect("/auth/logout");
			} else {
				session.logged = {
					...result,
					type: "kinde",
				};
				res.redirect("/");
			}
		}),
	);
}

async function loginKinde(req: Request, res: Response, profile: UserType) {
	try {
		// Download picture that is provided by Kinde
		const picture = await handleAvatarDownload(profile.picture);

		return await handleCallbackLogin(req, {
			name: profile.given_name,
			surname: profile.family_name,
			email: profile.email,
			handles: [profile.id],
			picture,
		});
	} catch (error) {
		return null;
	}
}

async function authenticateKinde(
	state: ServerState,
	req: Request,
): Promise<LoginData | null> {
	assert(req.store, "Store instance is not available.");

	const session = req.session as SessionStore;

	if (state.auth.kinde.instance) {
		const manager = createSessionManager(req);
		const isAuthenticated =
			await state.auth.kinde.instance.isAuthenticated(manager);

		if (isAuthenticated && session.logged) {
			return session.logged;
		}
	}

	return null;
}

function createSessionManager(req: Request): SessionManager {
	const session = req.session as SessionStore;

	return {
		getSessionItem(key: string) {
			const store = (session.kinde = session.kinde ?? {});
			return Promise.resolve(store[key]);
		},
		setSessionItem(key: string, value: unknown) {
			const store = (session.kinde = session.kinde ?? {});
			store[key] = value;
			return Promise.resolve();
		},
		removeSessionItem(key: string) {
			const store = (session.kinde = session.kinde ?? {});
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete store[key];
			return Promise.resolve();
		},
		destroySession() {
			session.kinde = {};
			return Promise.resolve();
		},
	};
}

//TOKEN

async function authenticateToken(
	state: ServerState,
	req: Request,
): Promise<LoginData | null> {
	assert(req.auth, "Auth store instance is not available.");

	const token = parseBearer(req.headers.authorization);

	if (token) {
		const res = await req.auth.token(token);
		if (res) {
			return {
				...res,
				type: "token",
			};
		}
	}

	return null;
}

//UNIVERSAL

async function handleAvatarDownload(url: string | null) {
	if (!url) {
		return null;
	}

	try {
		// Try to download the image and convert it to base64 data URL
		const res = await fetch(url);
		const type = res.headers.get("content-type");
		const data = await res.arrayBuffer();
		return `data:${type ?? ""};base64,${Buffer.from(data).toString("base64")}`;
	} catch (error) {
		// If the download fails, return the original URL and use it as a fallback
		return url;
	}
}

async function handleCallbackLogin(req: Request, loginData: LoginData) {
	assert(req.auth, "Auth store instance is not available.");

	return await req.auth.login(loginData);
}

function parseBearer(bearer = "") {
	const [type, token] = bearer.trim().split(" ");

	if (type === "Bearer") {
		return token;
	}
	return null;
}
