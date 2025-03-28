import { SxProps, Theme } from "@mui/material";

export function getCookieBannerPaperStyles(): SxProps<Theme> {
	return {
		position: "fixed",
		bottom: 0,
		left: 0,
		right: 0,
		m: 0,
		p: 2,
		borderWidth: 0,
		borderTopWidth: 1,
	};
}

export function getCookieBannerMainStyles(): SxProps<Theme> {
	return {
		flexDirection: { xs: "column", sm: "row" },
		justifyContent: "space-between",
		gap: 2,
	};
}

export function getCookieBannerContentStyles(): SxProps<Theme> {
	return {
		flexShrink: 1,
		alignSelf: { xs: "flex-start", sm: "center" },
	};
}

export function getCookieBannerButtonStyles(): SxProps<Theme> {
	return {
		flexDirection: {
			xs: "row-reverse",
			sm: "row",
		},
		flexShrink: 0,
		alignSelf: "flex-end",
		gap: 2,
	};
}

export function getCookieSwitcherStyles(): SxProps<Theme> {
	return {
		maxWidth: 350,
		cursor: "pointer",
	};
}

export function getCookieSwitchersStyles(): SxProps<Theme> {
	return {
		m: 1,
		gap: 2,
		flexShrink: 1,
		flexDirection: { xs: "column", sm: "row" },
	};
}
