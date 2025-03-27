import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
	// interface ThemeOptions {}
	//interface Palette {}
	//interface PaletteOptions {}
}

export const LightTheme = createTheme({
	palette: {
		mode: "light",
	},
});

export const DarkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});
