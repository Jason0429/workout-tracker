import { useState } from "react";

import { ExerciseType } from "../models";
import AddExerciseDialog from "../components/MyExercises/AddExerciseDialog";
import EditExerciseDialog from "../components/MyExercises/EditExerciseDialog";
import ConfirmationDialog from "../components/Global/ConfirmationDialog";
import { deleteExercise } from "../states/userState";
import { handleOpenSnackbar } from "../states/snackbarState";
import ListOfExercises from "../components/MyExercises/ListOfExercises";
import Controlbar from "../components/MyExercises/Controlbar";

function MyExercisesPage() {
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
			await deleteExercise(selectedExerciseToDelete as ExerciseType);

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
			<ListOfExercises
				searchedExercise={searchedExercise}
				setSearchedExercise={setSearchedExercise}
				handleOpenEditExerciseDialog={handleOpenEditExerciseDialog}
				handleDeleteExerciseBeforeConfirmation={handleDeleteExerciseBeforeConfirmation}
			/>
			{/* Bottom Fixed Row */}
			<Controlbar setOpenAddExerciseDialog={setOpenAddExerciseDialog} />
		</>
	);
}

export default MyExercisesPage;
