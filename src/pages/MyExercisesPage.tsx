// React
import { useState, useContext } from "react";

// // Components
// import EditExerciseDialog from '../components/MyExercises/EditExerciseDialog';
// import AddExerciseDialog from '../components/MyExercises/AddExerciseDialog';
// import ConfirmationDialog from '../components/global/ConfirmationDialog';

// Material
import { IconButton, Typography, Stack, ListItemText, Paper, List, ListItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
	ExerciseType,
	SnackbarStateType,
	ThemeStateType,
	UserStateType,
	UserType
} from "../models";
import { useStyles } from "../styles/classes";
import UserContext from "../contexts/userContext";
import ThemeContext from "../contexts/themeContext";
import SnackbarContext from "../contexts/snackbarContext";
import AddExerciseDialog from "../components/MyExercises/AddExerciseDialog";
import EditExerciseDialog from "../components/MyExercises/EditExerciseDialog";
import ConfirmationDialog from "../components/Global/ConfirmationDialog";
import FirebaseObject from "../firebase/firebase";

function MyExercisesPage() {
	const [user] = useContext(UserContext) as UserStateType;
	const [theme] = useContext(ThemeContext) as ThemeStateType;
	const [snackbar, setSnackbar] = useContext(SnackbarContext) as SnackbarStateType;
	const classes = useStyles();
	const [expanded, setExpanded] = useState(true);

	// Filters available exercises to search preference.
	const [searchedExercise, setSearchedExercise] = useState("");

	// Indicates open state of Adding Exercise Dialog.
	const [openAddExerciseDialog, setOpenAddExerciseDialog] = useState<boolean>(false);

	// Indicates open state of Editing Exercise Dialog.
	const [openEditExerciseDialog, setOpenEditExerciseDialog] = useState<boolean>(false);

	// Indicates open state of Confirmation Dialog.
	const [openConfirmationDialog, setOpenConfirmationDialog] = useState<boolean>(false);

	// Keeps track of which exercise is chosen to edit.
	const [selectedExerciseToEdit, setSelectedExerciseToEdit] = useState<ExerciseType | null>(null);

	// Keeps track of which exercise to delete.
	const [selectedExerciseToDelete, setSelectedExerciseToDelete] = useState<ExerciseType | null>(
		null
	);

	/**
	 * Handles opening snackbar with message.
	 * @param message message to be shown in snackbar.
	 */
	function handleOpenSnackbar(message: string) {
		setSnackbar((prev) => ({
			...prev,
			open: true,
			message
		}));
	}

	/**
	 * Handles opening Edit Exercise Dialog.
	 * @param exercise the exercise to edit.
	 */
	function handleOpenEditExerciseDialog(exercise: ExerciseType) {
		setSelectedExerciseToEdit(exercise);
		setOpenEditExerciseDialog(true);
	}

	/**
	 * Handles closing exercise dialog and resetting selected exercise to edit.
	 */
	function handleCloseEditExerciseDialog() {
		setOpenEditExerciseDialog(false);
		setTimeout(() => setSelectedExerciseToEdit(null), 300);
	}

	/**
	 * Handles deleting exercise from user's list of exercises.
	 * - Opens confirmation dialog first.
	 * @param {Exercise} exercise the exercise to be deleted.
	 */
	function handleDeleteExerciseBeforeConfirmation(exercise: ExerciseType) {
		setSelectedExerciseToDelete(exercise);
		setOpenConfirmationDialog(true);
	}

	/**
	 * Handles deleting exercise from user's list of exercises.
	 * - Closes confirmation dialog after confirmation.
	 * @param {Exercise} exercise the exercise to be deleted.
	 */
	async function handleDeleteExerciseAfterConfirmation() {
		try {
			const firebaseObj = new FirebaseObject();
			await firebaseObj.deleteExercise(
				user as UserType,
				selectedExerciseToDelete as ExerciseType
			);

			// Close confirmation dialog.
			setOpenConfirmationDialog(false);

			// Reset exercise to be deleted.
			setSelectedExerciseToDelete(null);

			handleOpenSnackbar(
				`Exercise: ${selectedExerciseToDelete?.name} as been successfully deleted.`
			);
		} catch (e) {
			handleOpenSnackbar(
				`Something went wrong. Exercise: ${selectedExerciseToDelete?.name} could not be deleted.`
			);
		}
	}

	/**
	 * Returns ascending sort comparator value based on exercise names.
	 * @param a first exercise.
	 * @param b second exercise.
	 * @returns value to determine sorting of exercise.
	 */
	function comparator(a: ExerciseType, b: ExerciseType): -1 | 0 | 1 {
		if (a.name < b.name) {
			return -1;
		} else if (a.name > b.name) {
			return 1;
		}
		return 0;
	}

	return (
		<>
			{/* Confirmation Dialog */}
			{selectedExerciseToDelete && (
				<ConfirmationDialog
					open={openConfirmationDialog}
					onClose={() => setOpenConfirmationDialog(false)}
					title={`Delete ${selectedExerciseToDelete?.name}?`}
					message={
						<>
							Are you sure you want to delete{" "}
							<span style={{ fontWeight: "bold" }}>
								{selectedExerciseToDelete?.name}
							</span>
						</>
					}
					yesFunction={handleDeleteExerciseAfterConfirmation}
				/>
			)}
			{/* Add Exercise Dialog */}
			<AddExerciseDialog
				open={openAddExerciseDialog}
				onClose={() => setOpenAddExerciseDialog(false)}
			/>
			{/* Edit Exercise Dialog */}
			{selectedExerciseToEdit && (
				<EditExerciseDialog
					open={openEditExerciseDialog}
					onClose={handleCloseEditExerciseDialog}
					exercise={selectedExerciseToEdit}
				/>
			)}
			{/* List of Exercises */}
			<Stack
				direction='column'
				sx={{
					margin: "100px 0 200px 0",
					width: "95%",
					maxWidth: "600px"
				}}
			>
				<Paper
					variant='outlined'
					sx={{
						width: "100%"
					}}
				>
					<Paper
						sx={{
							padding: "10px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						}}
					>
						<Typography variant='h6'>My Exercises</Typography>
					</Paper>

					<Paper
						elevation={0}
						sx={{
							padding: "15px",
							borderTop: "1px solid lightgray",
							borderBottom: "1px solid lightgray"
						}}
					>
						<input
							placeholder='Search for exercise'
							className={classes.roundInputField}
							value={searchedExercise}
							onChange={(e) => setSearchedExercise(e.target.value)}
							style={{
								background: theme.paperBackground,
								transition: theme.transition
							}}
						/>
					</Paper>
					<List
						sx={{
							width: "100%",
							padding: "0"
						}}
					>
						{user?.exercises
							.sort((a: ExerciseType, b: ExerciseType) => comparator(a, b))
							.filter((exercise: ExerciseType) =>
								exercise?.name
									.toLowerCase()
									.includes(searchedExercise.toLowerCase())
							)
							.map((exercise: ExerciseType, idx: number) => (
								<ListItem
									divider
									key={idx}
									secondaryAction={
										<Stack direction='row' alignItems='center' spacing={1}>
											<IconButton
												edge='end'
												aria-label='edit'
												// To edit exercise
												onClick={() =>
													handleOpenEditExerciseDialog(exercise)
												}
											>
												<EditIcon />
											</IconButton>
											<IconButton
												edge='end'
												aria-label='delete'
												// To delete exercise
												onClick={() =>
													handleDeleteExerciseBeforeConfirmation(exercise)
												}
											>
												<DeleteIcon />
											</IconButton>
										</Stack>
									}
								>
									<ListItemText primary={exercise?.name} />
								</ListItem>
							))}
					</List>
				</Paper>
			</Stack>
			{/* Bottom Fixed Row */}
			<Paper
				variant='outlined'
				sx={{
					zIndex: 2,
					padding: "20px",
					position: "fixed",
					bottom: 0,
					background: "#ffffff",
					width: "100%"
				}}
			>
				<Stack direction='column' alignItems='center' justifyContent='center'>
					<button
						className={classes.blueBtn}
						onClick={() => setOpenAddExerciseDialog(true)}
					>
						+ Add New Exercise
					</button>
				</Stack>
			</Paper>
		</>
	);
}

export default MyExercisesPage;
