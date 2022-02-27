// React
import { Children, useContext } from "react";

// Material
import { Stack, Typography, Paper } from "@mui/material";

// Images
import GoogleLogo from "../../imgs/google_logo.png";

// Theme
// import { useAppSelector } from "../../app/hooks";
import ThemeContext from "../../contexts/themeContext";
import { ThemeStateType } from "../../models";

interface Props {
	children?: string;
	onClick: () => any;
}

function GoogleSignInButton({ children, onClick }: Props) {
	// const theme = useAppSelector((state) => state.theme);
	const [theme] = useContext(ThemeContext) as ThemeStateType;

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
					{children || "Sign In With Google"}
				</Typography>
			</Stack>
		</Paper>
	);
}

export default GoogleSignInButton;
