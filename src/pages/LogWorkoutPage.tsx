import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStyles } from "../styles/classes";
import { useWindowSize } from "../hooks";
import { useThemeState } from "../states/ThemeState";
import TemplateStartContainer from "../components/LogWorkoutPage/TemplateStartContainer";

function LogWorkoutPage() {
	const theme = useThemeState();
	const classes = useStyles();
	const [width] = useWindowSize();
	const navigate = useNavigate();

	return (
		<Stack
			direction='column'
			spacing={3}
			sx={{
				width: "100%",
				height: "100vh",
				maxWidth: "800px",
				padding: "20px",
				alignItems: `${width > 400 ? "" : "center"}`
			}}
		>
			<Stack direction='column' spacing={2}>
				<Typography
					variant='h5'
					sx={{
						color: theme.text
					}}
				>
					Templates
				</Typography>
				<TemplateStartContainer />
			</Stack>
			<div className={classes.greenBtn} onClick={() => navigate("/createTemplate")}>
				Create A Template
			</div>
			<div className={classes.blueBtn} onClick={() => navigate("/createWorkout")}>
				Start Own Workout
			</div>
		</Stack>
	);
}

export default LogWorkoutPage;
