import { Stack, Typography, Paper } from "@mui/material";

// Images
import GoogleLogo from "../../imgs/google_logo.png";
import { useThemeState } from "../../states/ThemeState";
interface Props {
	children?: string;
	onClick: () => any;
}

function GoogleSignOutButton({ children, onClick }: Props) {
	const theme = useThemeState();

	return (
		<Paper
			elevation={0}
			variant='outlined'
			sx={{
				padding: "0 10px",
				cursor: "pointer",
				height: "50px",
				width: "fit-content",
				background: theme.paperBackground,
				transition: theme.transition
			}}
		>
			<Stack
				direction='row'
				sx={{
					alignItems: "center",
					justifyContent: "space-between",
					height: "100%",
					width: "100%"
				}}
				onClick={onClick}
			>
				<img
					src={GoogleLogo}
					alt='google logo'
					style={{
						height: "30px"
					}}
				/>
				&nbsp; &nbsp;
				<Typography
					sx={{
						color: theme.text,
						transition: theme.transition
					}}
				>
					{children || "Sign Out"}
				</Typography>
			</Stack>
		</Paper>
	);
}

export default GoogleSignOutButton;
