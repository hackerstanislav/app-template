import { CssBaseline } from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";

import { ThemeProvider } from "../providers/theme";

import { GLOBAL_STYLES } from "./index.styles";
import Default from "./Default";

function Root() {
	return (
		<ThemeProvider supportsDarkMode={true}>
			<CssBaseline />
			<GlobalStyles styles={GLOBAL_STYLES} />
			<Default />
		</ThemeProvider>
	);
}

export default Root;
