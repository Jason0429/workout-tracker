import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStyles } from "../styles/classes";
import TemplateStart from "../components/LogWorkoutPage/TemplateStart";
import { useWindowSize } from "../hooks";
import { useUserState } from "../states/UserState";
import { TemplateType } from "../firebase/Template";
import { UserType } from "../firebase/User";
import { useThemeState } from "../states/ThemeState";

function LogWorkoutPage() {
	const user = useUserState() as UserType;
	const theme = useThemeState();
	const classes = useStyles();
	const [width] = useWindowSize();
	const navigate = useNavigate();

	return (
		<div className={classes.mainContainer}>
			<Stack
				direction='column'
				spacing={3}
				sx={{
					width: "100%",
					height: "100vh",
					maxWidth: "800px",
					padding: "0 20px",
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
					<Stack
						direction='row'
						gap={2}
						style={{
							flexWrap: "wrap",
							width: "100%",
							alignItems: `${width > 400 ? "" : "center"}`,
							justifyContent: `${width > 400 ? "" : "center"}`
						}}
					>
						{/* Render Templates Section */}
						{user.templates.length === 0 ? (
							<Typography
								style={{
									color: theme.text,
									transition: theme.transition
								}}
							>
								You currently have no templates.
							</Typography>
						) : (
							user.templates.map((template: TemplateType, idx: number) => (
								<TemplateStart key={idx} template={template} />
							))
						)}
					</Stack>
				</Stack>
				<div className={classes.greenBtn} onClick={() => navigate("/createTemplate")}>
					Create A Template
				</div>
				<div className={classes.blueBtn} onClick={() => navigate("/createWorkout")}>
					Start Own Workout
				</div>
			</Stack>
		</div>
	);
}

export default LogWorkoutPage;
