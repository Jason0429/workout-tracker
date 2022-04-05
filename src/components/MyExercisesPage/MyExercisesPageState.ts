import { createState, useHookstate } from "@hookstate/core";
import { deleteExercise, Exercise, ExerciseType, updateExercise } from "../../firebase/Exercise";
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
		getState() {
			return state;
		},
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
			state.search.set(search);
		},

		/**
		 * Handles opening add exercise dialog.
		 */
		handleOpenAddExerciseDialog() {
			state.openAddExerciseDialog.set(true);
			// state.exerciseToAdd.set(Exercise());
		},

		/**
		 * Handles closing add exercise dialog.
		 */
		handleCloseAddExerciseDialog() {
			// state.exerciseToAdd.set(Exercise());/
			state.openAddExerciseDialog.set(false);
		},

		/**
		 * Handles setting selectedExerciseToEdit and
		 * opening edit exercise dialog.
		 * @param exercise the exercise to be edited.
		 */
		handleOpenEditExerciseDialog(exercise: ExerciseType) {
			// console.log('Opening');
			// console.log(state.get());
			state.selectedExerciseToEdit.set(exercise);
			state.openEditExerciseDialog.set(true);
		},

		/**
		 * Handles closing edit exercise dialog and
		 * clearing selectedExerciseToEdit.
		 */
		handleCloseEditExerciseDialog() {
			state.openEditExerciseDialog.set(false);
			state.selectedExerciseToEdit.set(null);
		},

		/**
		 * Handles opening confirmation dialog.
		 */
		handleOpenConfirmationDialog() {
			state.openConfirmationDialog.set(true);
		},

		/**
		 * Handles opening confirmation dialog.
		 */
		handleCloseConfirmationDialog() {
			state.openConfirmationDialog.set(false);
		},

		/**
		 * Handles deleting exercise from user's list of exercises.
		 * - Opens confirmation dialog first.
		 * @param exercise the exercise to be deleted.
		 */
		handleDeleteExerciseBeforeConfirmation(exercise: ExerciseType) {
			state.selectedExerciseToDelete.set(exercise);
			state.openConfirmationDialog.set(true);
		},

		/**
		 * Handles deleting exercise from user's list of exercises.
		 * - Closes confirmation dialog after confirmation.
		 * @param exercise the exercise to be deleted.
		 */
		async handleDeleteExerciseAfterConfirmation() {
			try {
				await deleteExercise(state.selectedExerciseToDelete.get()!.id);

				state.set((prev) => ({
					...prev,
					openConfirmationDialog: false,
					selectedExerciseToDelete: null
				}));

				snackbar.handleOpenSnackbar(
					`Exercise: ${
						state.selectedExerciseToDelete.get()?.name
					} as been successfully deleted.`
				);
			} catch (e) {
				snackbar.handleOpenSnackbar(
					`Something went wrong. Exercise: ${
						state.selectedExerciseToDelete.get()?.name
					} could not be deleted.`
				);
			}
		},

		handleEditExerciseName(name: string) {
			if (state.selectedExerciseToEdit.get()) {
				state.selectedExerciseToEdit.set((prev) => ({
					...(prev as ExerciseType),
					name
				}));
			}
		},

		// handleSetCategory(category: string) {
		// 	state.category.set(category);
		// },

		/**
		 * Handles adding category to selected exercise to edit.
		 * @param category category to be added.
		 */
		handleAddCategoryToEditExercise(category: string) {
			if (category === "") return;

			if (state.selectedExerciseToEdit.get()) {
				state.selectedExerciseToEdit.set((prev) => ({
					...(prev as ExerciseType),
					categories: [...(prev as ExerciseType).categories, category]
				}));
			}
		},

		/**
		 * Handles deleting category from exercise.
		 * - Takes index instead of category name to prevent deleting duplicates.
		 * @param idx the index of the category to be deleted from exercise.
		 */
		handleDeleteCategory(idx: number) {
			if (state.selectedExerciseToEdit.get()) {
				state.selectedExerciseToEdit.set((prev) => ({
					...(prev as ExerciseType),
					categories: (prev as ExerciseType).categories.filter(
						(_, i: number) => i !== idx
					)
				}));
			}
		},

		/**
		 * Handles updating exercise in database.
		 */
		async handleUpdateExercise() {
			if (state.selectedExerciseToEdit.get()) {
				const exercise = state.selectedExerciseToEdit.get() as ExerciseType;
				console.log(exercise);
				try {
					await updateExercise(exercise);
					snackbar.handleOpenSnackbar(
						`Exercise: ${exercise.name} has been successfully updated.`
					);
					// this.handleCloseEditExerciseDialog();
				} catch (e) {
					snackbar.handleOpenSnackbar(
						`Something went wrong. Exercise: ${exercise.name} could not be updated.`
					);
				}
			}
		}
	};
};
