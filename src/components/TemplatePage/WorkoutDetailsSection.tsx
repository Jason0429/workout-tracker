import { Stack, Typography } from "@mui/material";
import { useThemeState } from "../../states/ThemeState";
import { useStyles } from "../../styles/classes";
import ExerciseTemplate from "./ExerciseTemplate";
import { useTemplatePageState } from "./TemplatePageState";

function WorkoutDetailsSection() {
	const classes = useStyles();
	const theme = useThemeState();
	const templatePageState = useTemplatePageState();

	return (
		<Stack direction='column' spacing={2} style={{ width: "350px", height: "100%" }}>
			<Typography
				variant='h6'
				textAlign='center'
				sx={{
					textAlign: "center",
					color: theme.text,
					transition: theme.transition
				}}
			>
				{/* Title of the page */}
				{templatePageState.title}
			</Typography>
			<Stack direction='column' spacing={3} alignItems='center'>
				{/* Template Name Input */}
				<input
					placeholder='Workout Name'
					className={classes.roundInputField}
					value={templatePageState.template.name}
					onChange={(e) => templatePageState.handleChangeName(e.target.value)}
					style={{
						background: theme.paperBackground,
						color: theme.text,
						transition: theme.transition
					}}
				/>
				{/* Render all exercises here */}
				<Stack direction='column' spacing={2} alignItems='center'>
					{/* Exercise Template */}
					{templatePageState.template.exercises.map((e, idx) => (
						<ExerciseTemplate exercise={e} key={idx} exerciseIdx={idx} />
					))}
				</Stack>
			</Stack>
		</Stack>
	);
}

export default WorkoutDetailsSection;
