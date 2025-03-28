import { useMemo } from "react";

import { LightTheme, DarkTheme } from "../themes/theme.default";

export function useSelectedTheme(supportDarkMode: boolean) {
	return useMemo(() => {
		const isDark =
			supportDarkMode &&
			window.matchMedia("(prefers-color-scheme: dark)").matches;

		if (isDark) {
			return {
				...DarkTheme,
			};
		} else {
			return {
				...LightTheme,
			};
		}
	}, [supportDarkMode]);
}
