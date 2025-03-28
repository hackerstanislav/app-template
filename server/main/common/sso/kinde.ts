import {
	GrantType,
	createKindeServerClient,
} from "@kinde-oss/kinde-typescript-sdk";

import { ServerState } from "../state";

export function createKindeAuthProvider(state: ServerState) {
	const options = {
		authDomain: state.auth.kinde.domain,
		clientId: state.auth.kinde.clientId,
		clientSecret: state.auth.kinde.clientSecret,
		redirectURL: state.auth.kinde.redirectURL,
		logoutRedirectURL: state.auth.kinde.logoutURL,
	};

	return createKindeServerClient(GrantType.AUTHORIZATION_CODE, options);
}
