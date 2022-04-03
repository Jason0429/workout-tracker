import { createState, useHookstate } from "@hookstate/core";
import { deleteExercise, ExerciseType } from "../../firebase/Exercise";
import { useSnackbarState } from "../../states/SnackbarState";

export type MyExercisesPageState = {
	search: string;
	openAddExerciseDialog: boolean;
	openEditExerciseDialog: boolean;
	openConfirmationDialog: boolean;
	selectedExerciseToEdit: ExerciseType | null;
	selectedExerciseToDelete: ExerciseType | null;
};

const myExercisesPageState = createState({
	search: "",
	openAddExerciseDialog: false,
	openEditExerciseDialog: false,
	openConfirmationDialog: false,
	selectedExerciseToEdit: null,
	selectedExerciseToDelete: null
} as MyExercisesPageState);

export const useMyExercisesPageState = () => {
	const state = useHookstate(myExercisesPageState);
	const snackbar = useSnackbarState();

	return {
		get search() {
			return state.search.get();
		},
		get openAddExerciseDialog() {
			return state.openAddExerciseDialog.get();
		},
		get openEditExerciseDialog() {
			return state.openEditExerciseDialog.get();
		},
		get openConfirmationDialog() {
			return state.openConfirmationDialog.get();
		},
		get selectedExerciseToEdit() {
			return state.selectedExerciseToEdit.get();
		},
		get selectedExerciseToDelete() {
			return state.selectedExerciseToDelete.get();
		},

		/**
		 * Initializes state.
		 */
		init() {
			state.set({
				search: "",
				openAddExerciseDialog: false,
				openEditExerciseDialog: false,
				openConfirmationDialog: false,
				selectedExerciseToEdit: null,
				selectedExerciseToDelete: null
			});
		},

		/**
		 * Handles search on change.
		 */
		handleSearchOnChange(search: string) {
			state.set((prev) => ({
				...prev,
				search
			}));
		},

		/**
		 * Handles opening add exercise dialog.
		 */
		handleOpenAddExerciseDialog() {
			state.set((prev) => ({
				...prev,
				openAddExerciseDialog: true
			}));
		},

		/**
		 * Handles closing add exercise dialog.
		 */
		handleCloseAddExerciseDialog() {
			state.set((prev) => ({
				...prev,
				openAddExerciseDialog: false
			}));
		},

		/**
		 * Handles setting selectedExerciseToEdit and
		 * opening edit exercise dialog.
		 * @param exercise the exercise to be edit.
		 */
		handleOpenEditExerciseDialog(exercise: ExerciseType) {
			state.set((prev) => ({
				...prev,
				selectedExerciseToEdit: exercise,
				openEditExerciseDialog: true
			}));
		},

		/**
		 * Handles closing edit exercise dialog and
		 * clearing selectedExerciseToEdit.
		 */
		handleCloseEditExerciseDialog() {
			state.set((prev) => ({
				...prev,
				selectedExerciseToEdit: null,
				openEditExerciseDialog: false
			}));
		},

		/**
		 * Handles opening confirmation dialog.
		 */
		handleOpenConfirmationDialog() {
			state.set((prev) => ({
				...prev,
				openConfirmationDialog: true
			}));
		},

		/**
		 * Handles opening confirmation dialog.
		 */
		handleCloseConfirmationDialog() {
			state.set((prev) => ({
				...prev,
				openConfirmationDialog: false
			}));
		},

		/**
		 * Handles deleting exercise from user's list of exercises.
		 * - Opens confirmation dialog first.
		 * @param exercise the exercise to be deleted.
		 */
		handleDeleteExerciseBeforeConfirmation(exercise: ExerciseType) {
			state.set((prev) => ({
				...prev,
				selectedExerciseToDelete: exercise,
				openConfirmationDialog: true
			}));
		},

		/**
		 * Handles deleting exercise from user's list of exercises.
		 * - Closes confirmation dialog after confirmation.
		 * @param exercise the exercise to be deleted.
		 */
		async handleDeleteExerciseAfterConfirmation() {
			try {
				await deleteExercise(this.selectedExerciseToDelete!.id);

				state.set((prev) => ({
					...prev,
					openConfirmationDialog: false,
					selectedExerciseToDelete: null
				}));

				snackbar.handleOpenSnackbar(
					`Exercise: ${this.selectedExerciseToDelete!.name} as been successfully deleted.`
				);
			} catch (e) {
				snackbar.handleOpenSnackbar(
					`Something went wrong. Exercise: ${
						this.selectedExerciseToDelete!.name
					} could not be deleted.`
				);
			}
		}
	};
};
