import { Stack, Typography } from "@mui/material";
import { globalTheme } from "../../states/theme.state";
import { globalTemplatePage } from "../../states/TemplatePage.state";
import { useHookstate } from "@hookstate/core";
import { useStyles } from "../../styles/classes";
import ExerciseTemplate from "./ExerciseTemplate";

function WorkoutDetailsSection() {
	const classes = useStyles();
	const theme = useHookstate(globalTheme);
	const templatePageState = useHookstate(globalTemplatePage);

	return (
		<Stack direction='column' spacing={2} style={{ width: "350px", height: "100%" }}>
			<Typography
				variant='h6'
				textAlign='center'
				sx={{
					textAlign: "center",
					color: theme.text.value,
					transition: theme.transition.value
				}}
			>
				{/* Title of the page */}
				{templatePageState.title.value}
			</Typography>
			<Stack direction='column' spacing={3} alignItems='center'>
				{/* Template Name Input */}
				<input
					placeholder='Workout Name'
					className={classes.roundInputField}
					value={templatePageState.template.name.value}
					onChange={(e) =>
						templatePageState.template.set((prev) => ({
							...prev,
							name: e.target.value
						}))
					}
					style={{
						background: theme.paperBackground.value,
						color: theme.text.value,
						transition: theme.transition.value
					}}
				/>
				{/* Render all exercises here */}
				<Stack direction='column' spacing={2} alignItems='center'>
					{/* Exercise Template */}
					{templatePageState.template.exercises.value.map((e, idx) => (
						<ExerciseTemplate exercise={e} key={idx} exerciseIdx={idx} />
					))}
				</Stack>
			</Stack>
		</Stack>
	);
}

export default WorkoutDetailsSection;
