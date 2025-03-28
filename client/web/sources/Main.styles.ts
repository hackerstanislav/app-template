import { SxProps, Theme } from "@mui/material";

export function getRootStyles(): SxProps<Theme> {
	return {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		minHeight: "100vh",
	};
}
