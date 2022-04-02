import { useThemeState } from "../states/ThemeState";
import { useStyles } from "../styles/classes";

function LoadingPage() {
	const classes = useStyles();
	const theme = useThemeState();

	return (
		<div
			className={classes.mainContainer}
			style={{
				background: theme.background,
				transition: theme.transition,
				color: theme.text
			}}
		>
			{"Loading..."}
		</div>
	);
}

export default LoadingPage;
