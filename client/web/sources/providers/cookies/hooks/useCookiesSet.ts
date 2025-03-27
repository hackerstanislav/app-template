import { useContext } from "react";

import { CookiesContext } from "../context/CookiesContext";

export function useCookiesSet() {
	const context = useContext(CookiesContext);

	return context.onApprove;
}
