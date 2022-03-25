import { useState } from "react";
import { ExerciseType, Exercise, Set } from "../../models";
import { List, ListItem, ListItemText, Dialog, DialogTitle, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useStyles } from "../../styles/classes";
import {
	globalTemplatePage,
	handleAddExercise,
	handleCloseDialog
} from "../../states/TemplatePage.state";
import { handleOpenSnackbar } from "../../states/snackbar.state";
import { addCustomExercise, globalUser } from "../../states/user.state";
import { useHookstate } from "@hookstate/core";
import { globalTheme } from "../../states/theme.state";

function ExercisesDialog() {
	const classes = useStyles();
	const user = useHookstate(globalUser);
	const theme = useHookstate(globalTheme);
	const templatePageState = useHookstate(globalTemplatePage);
	const [searchTerm, setSearchTerm] = useState("");
	const [customExerciseName, setCustomExerciseName] = useState("");

	/**
	 * Resets input fields.
	 * Closes dialog.
	 */
	function handleCloseDialogAndClear() {
		setSearchTerm("");
		setCustomExerciseName("");
		handleCloseDialog();
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

		handleAddExercise(exerciseWithSet);
		handleCloseDialogAndClear();
	}

	/**
	 * Handles adding custom exercise to database.
	 * @param exerciseName the name of custom exercise.
	 */
	async function handleAddCustomExercise(exerciseName: string) {
		const customExercise = Exercise(exerciseName.trim(), []);

		try {
			await addCustomExercise(customExercise as ExerciseType);

			// Add this custom exercise to current template/workout.
			// Closes add exercise dialog.
			handleAddExerciseAndClear(customExercise);

			handleOpenSnackbar(
				`Custom Exercise: ${exerciseName.trim()} has been successfully added.`
			);
		} catch (e) {
			handleOpenSnackbar(
				`Something went wrong. Custom Exercise: ${exerciseName.trim()} could not be added.`
			);
		}
	}

	return (
		<Dialog
			// If you press outside of dialog
			onClose={handleCloseDialogAndClear}
			open={templatePageState.openExerciseDialog.value}
			fullWidth={true}
			sx={{
				background: theme.background.value
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
					background: theme.background.value,
					zIndex: 1,
					paddingBottom: "20px",
					borderBottom: "1px solid #00000020"
				}}
			>
				<DialogTitle
					sx={{
						color: theme.text.value,
						transition: theme.transition.value
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
							background: theme.paperBackground.value,
							color: theme.text.value,
							transition: theme.transition.value
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
								background: theme.paperBackground.value,
								color: theme.text.value,
								transition: theme.transition.value
							}}
						/>
						<SendIcon
							className={classes.sendIcon}
							onClick={() => handleAddCustomExercise(customExerciseName)}
							sx={{
								color: theme.text.value,
								transition: theme.transition.value
							}}
						/>
					</Stack>
				</Stack>
			</Stack>

			{/* List of Exercises */}
			<List
				className={classes.list}
				sx={{
					background: theme.background.value,
					transition: theme.transition.value,
					height: "fit-content"
				}}
			>
				{user.value?.exercises
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
								primary={exercise?.name}
								sx={{
									color: theme.text.value,
									transition: theme.transition.value
								}}
							/>
						</ListItem>
					))}
			</List>
		</Dialog>
	);
}

export default ExercisesDialog;
