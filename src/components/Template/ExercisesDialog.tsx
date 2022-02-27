import { useState, useContext } from "react";
import {
	ExerciseType,
	ThemeStateType,
	UserStateType,
	UserType,
	SnackbarStateType,
	Exercise,
	Set
} from "../../models";
import { List, ListItem, ListItemText, Dialog, DialogTitle, Stack, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useStyles } from "../../styles/classes";
import UserContext from "../../contexts/userContext";
import ThemeContext from "../../contexts/themeContext";
import FirebaseObject from "../../firebase/firebase";
import SnackbarContext from "../../contexts/snackbarContext";
// import { useAppSelector } from "../../app/hooks";

type Props = {
	open: boolean;
	handleCloseDialog: () => void;
	handleAddExercise: (exercise: ExerciseType) => void;
};

function ExercisesDialog({ handleCloseDialog, open, handleAddExercise }: Props) {
	const classes = useStyles();
	const [user, setUser] = useContext(UserContext) as UserStateType;
	const [theme] = useContext(ThemeContext) as ThemeStateType;
	const [snackbar, setSnackbar] = useContext(SnackbarContext) as SnackbarStateType;
	const [searchTerm, setSearchTerm] = useState("");
	const [customExerciseName, setCustomExerciseName] = useState("");

	function comparator(a: ExerciseType, b: ExerciseType): -1 | 0 | 1 {
		if (a.name < b.name) {
			return -1;
		} else if (a.name > b.name) {
			return 1;
		}
		return 0;
	}

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
	 * Handles opening snackbar with message.
	 */
	function handleOpenSnackbar(message: string) {
		setSnackbar((prev) => ({
			...prev,
			open: true,
			message
		}));
	}

	/**
	 * Handles adding custom exercise to database.
	 * @param exerciseName the name of custom exercise.
	 */
	async function handleAddCustomExercise(exerciseName: string) {
		const customExercise = Exercise(exerciseName.trim(), []);

		try {
			const firebaseObj = new FirebaseObject();
			await firebaseObj.addCustomExercise(user as UserType, customExercise as ExerciseType);

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
			open={open}
			fullWidth={true}
			sx={{
				background: theme.background,
				backdropFilter: "none !important",
				filter: "none !important",
				height: "90vh !important"
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
					height: "90vh !important"
				}}
			>
				{user?.exercises
					.sort((a: ExerciseType, b: ExerciseType) => comparator(a, b))
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
