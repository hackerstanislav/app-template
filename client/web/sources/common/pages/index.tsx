import { CssBaseline } from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";

import Main from "../../Main";

import { GLOBAL_STYLES } from "./index.styles";

function Root() {
	return (
		<>
			<CssBaseline />
			<GlobalStyles styles={GLOBAL_STYLES} />
			<Main />
		</>
	);
}

export default Root;
