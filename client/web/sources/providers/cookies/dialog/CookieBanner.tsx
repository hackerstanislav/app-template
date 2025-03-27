import { useState } from "react";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import Switch from "@mui/material/Switch";
import { Trans, useTranslation } from "react-i18next";

import { useCookiesState } from "../hooks/useCookiesState";
import { COMPONENTS } from "../../../translations";
import { CookiesContextData } from "../types";

import {
	getCookieBannerButtonStyles,
	getCookieBannerContentStyles,
	getCookieBannerMainStyles,
	getCookieBannerPaperStyles,
	getCookieSwitchersStyles,
	getCookieSwitcherStyles,
} from "./CookiesBanner.styles";

export interface CookiesContextProps {
	onApproved: (data: CookiesContextData) => void;
	onRejectOptional: (data: CookiesContextData) => void;
}

export function CookieBanner({
	onApproved,
	onRejectOptional,
}: CookiesContextProps) {
	const { t } = useTranslation();
	const state = useCookiesState();
	const [bannerState, setBannerState] = useState<CookiesContextData>({
		approved: true,
		telemetry: true,
		trackingId: null,
	});

	// Already approved, do not show the banner
	if (state.approved) {
		return null;
	}

	const isAllowAll = bannerState.approved && bannerState.telemetry;

	return (
		<Backdrop open={true} sx={{ zIndex: 99999 }}>
			<Fade appear={false} in={true}>
				<Paper
					square
					tabIndex={-1}
					role="dialog"
					aria-modal="false"
					variant="outlined"
					sx={getCookieBannerPaperStyles()}
				>
					<Stack sx={getCookieBannerMainStyles()}>
						<Box sx={getCookieBannerContentStyles()}>
							<Typography variant="h5" fontWeight="bold">
								{t("cookies.banner.title")}
							</Typography>
							<Typography variant="body1">
								<Trans
									i18nKey="cookies.description"
									values={{ domain: window.location.hostname }}
									components={COMPONENTS}
								/>
							</Typography>
							<Stack sx={getCookieSwitchersStyles()}>
								<CookieSwitcher
									checked={bannerState.approved}
									disabled={true}
									title={t("cookies.system")}
									description={t("cookies.system.description")}
								/>
								<CookieSwitcher
									checked={bannerState.telemetry}
									title={t("cookies.telemetry")}
									description={t("cookies.telemetry.description")}
									onChange={(checked) => {
										setBannerState({ ...bannerState, telemetry: checked });
									}}
								/>
							</Stack>
						</Box>
						<Stack sx={getCookieBannerButtonStyles()}>
							<Button
								size="small"
								onClick={() => {
									onApproved(bannerState);
								}}
								variant="contained"
							>
								{isAllowAll ? t("cookies.allow_all") : t("cookies.selected")}
							</Button>
							<Button
								size="small"
								onClick={() => {
									onRejectOptional({
										approved: bannerState.approved,
										telemetry: false,
										trackingId: null,
									});
								}}
							>
								{t("cookies.reject_optional")}
							</Button>
						</Stack>
					</Stack>
				</Paper>
			</Fade>
		</Backdrop>
	);
}

interface CookieSwitcherProps {
	title: string;
	description: string;
	checked?: boolean;
	disabled?: boolean;
	onChange?: (checked: boolean) => void;
}

function CookieSwitcher({
	title,
	description,
	checked = false,
	disabled = false,
	onChange,
}: CookieSwitcherProps) {
	return (
		<Stack
			direction="row"
			sx={getCookieSwitcherStyles()}
			onClick={(e) => {
				e.stopPropagation();
				e.preventDefault();
				onChange?.(!checked);
			}}
		>
			<Switch
				checked={checked}
				disabled={disabled}
				onChange={() => {
					onChange?.(!checked);
				}}
				onClick={(e) => {
					e.stopPropagation();
				}}
			/>
			<Stack marginTop={1}>
				<Typography fontWeight="bold">{title}</Typography>
				<Typography variant="body2">{description}</Typography>
			</Stack>
		</Stack>
	);
}
