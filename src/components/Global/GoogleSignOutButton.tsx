import { useHookstate } from "@hookstate/core";
import { globalTheme } from "../../states/theme.state";
import { Stack, Typography, Paper } from "@mui/material";

// Images
import GoogleLogo from "../../imgs/google_logo.png";
interface Props {
	children?: string;
	onClick: () => any;
}

function GoogleSignOutButton({ children, onClick }: Props) {
	const theme = useHookstate(globalTheme);

	return (
		<Paper
			elevation={0}
			variant='outlined'
			sx={{
				padding: "0 10px",
				cursor: "pointer",
				height: "50px",
				width: "fit-content",
				background: theme.paperBackground.value,
				transition: theme.transition.value
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
						color: theme.text.value,
						transition: theme.transition.value
					}}
				>
					{children || "Sign Out"}
				</Typography>
			</Stack>
		</Paper>
	);
}

export default GoogleSignOutButton;
