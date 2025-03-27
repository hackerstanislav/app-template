import { CssBaseline } from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";

import { GLOBAL_STYLES } from "./index.styles";
import Default from "./Default";

function Root() {
	return (
		<>
			<CssBaseline />
			<GlobalStyles styles={GLOBAL_STYLES} />
			<Default />
		</>
	);
}

export default Root;
