import { useState } from "react";
import { List, ListItem, ListItemText, Dialog, DialogTitle, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useStyles } from "../../styles/classes";
import { ExerciseType, Exercise, addExercise } from "../../firebase/Exercise";
import { useThemeState } from "../../states/ThemeState";
import { useTemplatePageState } from "./TemplatePageState";
import { Set } from "../../firebase/Set";
import { useSnackbarState } from "../../states/SnackbarState";
import { UserType } from "../../firebase/User";
import { useUserState } from "../../states/UserState";

function ExercisesDialog() {
	const classes = useStyles();
	const user = useUserState() as UserType;
	const theme = useThemeState();
	const snackbar = useSnackbarState();
	const templatePageState = useTemplatePageState();
	const [searchTerm, setSearchTerm] = useState("");
	const [customExerciseName, setCustomExerciseName] = useState("");

	/**
	 * Resets input fields.
	 * Closes dialog.
	 */
	function handleCloseDialogAndClear() {
		setSearchTerm("");
		setCustomExerciseName("");
		templatePageState.handleCloseDialog();
	}

	/**
	 * Handles adding exercise.
	 * Closes dialog.
	 */
	function handleAddExerciseAndClear(exercise: ExerciseType) {
		// Add a single set row when adding exercise.
		const exerciseWithSet: ExerciseType = {
			...exercise,
			sets: [Set()]
		};

		templatePageState.handleAddExercise(exerciseWithSet);
		handleCloseDialogAndClear();
	}

	/**
	 * Handles adding custom exercise to database.
	 * @param exerciseName the name of custom exercise.
	 */
	async function handleAddCustomExercise(exerciseName: string) {
		const customExercise = Exercise(exerciseName.trim(), []);

		try {
			await addExercise(customExercise as ExerciseType);

			// Add this custom exercise to current template/workout.
			// Closes add exercise dialog.
			handleAddExerciseAndClear(customExercise);

			snackbar.handleOpenSnackbar(
				`Custom Exercise: ${exerciseName.trim()} has been successfully added.`
			);
		} catch (e) {
			snackbar.handleOpenSnackbar(
				`Something went wrong. Custom Exercise: ${exerciseName.trim()} could not be added.`
			);
		}
	}

	return (
		<Dialog
			// If you press outside of dialog
			onClose={handleCloseDialogAndClear}
			open={templatePageState.openExerciseDialog}
			fullWidth={true}
			sx={{
				background: theme.background
			}}
		>
			<Stack
				direction='column'
				sx={{
					position: "sticky",
					top: 0,
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
					background: theme.background,
					zIndex: 1,
					paddingBottom: "20px",
					borderBottom: "1px solid #00000020"
				}}
			>
				<DialogTitle
					sx={{
						color: theme.text,
						transition: theme.transition
					}}
				>
					Select an Exercise
				</DialogTitle>
				<Stack
					direction='column'
					spacing={2}
					sx={{
						width: "96%"
					}}
				>
					{/* Search Bar */}
					<input
						className={classes.roundInputField}
						placeholder='Search for exercise'
						onChange={(e) => setSearchTerm(e.target.value)}
						autoFocus
						style={{
							background: theme.paperBackground,
							color: theme.text,
							transition: theme.transition
						}}
					/>

					{/* Custom Exercise */}
					<Stack
						direction='row'
						alignItems='center'
						sx={{
							width: "100%",
							position: "relative"
						}}
					>
						<input
							className={classes.roundInputField}
							placeholder='Enter custom exercise'
							onChange={(e) => setCustomExerciseName(e.target.value)}
							onKeyPress={(e: any) =>
								e.key === "Enter"
									? handleAddCustomExercise(customExerciseName)
									: null
							}
							style={{
								background: theme.paperBackground,
								color: theme.text,
								transition: theme.transition
							}}
						/>
						<SendIcon
							className={classes.sendIcon}
							onClick={() => handleAddCustomExercise(customExerciseName)}
							sx={{
								color: theme.text,
								transition: theme.transition
							}}
						/>
					</Stack>
				</Stack>
			</Stack>

			{/* List of Exercises */}
			<List
				className={classes.list}
				sx={{
					background: theme.background,
					transition: theme.transition,
					height: "fit-content"
				}}
			>
				{user.exercises
					.map((e: ExerciseType) => e)
					.sort((a: ExerciseType, b: ExerciseType) => {
						if (a.name < b.name) {
							return -1;
						} else if (a.name > b.name) {
							return 1;
						}
						return 0;
					})
					.filter((exercise: ExerciseType) =>
						exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
					)
					.map((exercise: ExerciseType, idx: number) => (
						<ListItem
							button
							onClick={() => handleAddExerciseAndClear(exercise)}
							key={idx}
						>
							<ListItemText
								primary={exercise.name}
								sx={{
									color: theme.text,
									transition: theme.transition
								}}
							/>
						</ListItem>
					))}
			</List>
		</Dialog>
	);
}

export default ExercisesDialog;
