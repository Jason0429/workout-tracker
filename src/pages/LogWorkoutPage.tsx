import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStyles } from "../styles/classes";
import TemplateStart from "../components/LogWorkout/TemplateStart";
import { useWindowSize } from "../hooks";
import { useHookstate } from "@hookstate/core";
import { globalUser } from "../states/user.state";
import { globalTheme } from "../states/theme.state";
import { TemplateType } from "../models";

function LogWorkoutPage() {
	const classes = useStyles();
	const [width] = useWindowSize();
	const navigate = useNavigate();
	const user = useHookstate(globalUser);
	const theme = useHookstate(globalTheme);

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
							color: theme.value.text
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
						{user.value?.templates.length === 0 ? (
							<Typography
								style={{
									color: theme.value.text,
									transition: theme.value.transition
								}}
							>
								You currently have no templates.
							</Typography>
						) : (
							user.value?.templates.map((template: TemplateType, idx: number) => (
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
