import * as React from "react";
import { ThemeProvider as ThmProvider } from "@mui/material/styles";

import { useSelectedTheme } from "../hooks/useSelectedTheme";

export interface ThemeProviderProps {
	supportsDarkMode: boolean;
	children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
	children,
	supportsDarkMode,
}) => {
	const theme = useSelectedTheme(supportsDarkMode);
	return <ThmProvider theme={theme}>{children}</ThmProvider>;
};
