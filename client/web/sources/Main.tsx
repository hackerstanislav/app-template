import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

import { KINDE_LOGIN_URL, KINDE_REGISTER_URL } from "./common";
import { getRootStyles } from "./Main.styles";

function Main() {
	const { t } = useTranslation();

	return (
		<Box sx={getRootStyles()}>
			<Box textAlign="center" maxWidth={500}>
				<Typography variant="h3">app-template</Typography>
				<Typography variant="subtitle1" marginBottom={2}>
					Welcome to the app-template project!
				</Typography>
				<Typography variant="body2" textAlign="left">
					This is skeleton project for a web application. It is built with
					TypeScript, React, and Material-UI. It also support authentication and
					authorization using <strong>kinde platform</strong>.
				</Typography>
				<Stack direction="row" marginTop={3} spacing={2}>
					<Button
						fullWidth
						color="primary"
						variant="contained"
						size="large"
						href={KINDE_LOGIN_URL}
					>
						{t("common.login")}
					</Button>
					<Button
						fullWidth
						color="secondary"
						variant="text"
						size="large"
						href={KINDE_REGISTER_URL}
					>
						{t("common.register")}
					</Button>
				</Stack>
			</Box>
		</Box>
	);
}

export default Main;
