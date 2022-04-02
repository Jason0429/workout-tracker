import { createState, useHookstate } from "@hookstate/core";
import { WorkoutType, deleteWorkout } from "../../firebase/Workout";
import { useSnackbarState } from "../../states/SnackbarState";

type ProgressPageState = {
	selectedDate: Date | null;
	openConfirmationDialog: boolean;
	workoutToDelete: WorkoutType | null;
};

const progressPageState = createState({
	selectedDate: null,
	openConfirmationDialog: false,
	workoutToDelete: null
} as ProgressPageState);

export const useProgressPageState = () => {
	const state = useHookstate(progressPageState);
	const snackbarState = useSnackbarState();

	return {
		get selectedDate() {
			return state.selectedDate.get();
		},
		get openConfirmationDialog() {
			return state.openConfirmationDialog.get();
		},
		get workoutToDelete() {
			return state.workoutToDelete.get();
		},

		/**
		 * Initializes every time page is loaded.
		 */
		init() {
			state.set({
				selectedDate: new Date(),
				openConfirmationDialog: false,
				workoutToDelete: null
			});
		},

		/**
		 * Handles opening confirmation dialog.
		 */
		handleOpenConfirmationDialog() {
			state.openConfirmationDialog.set(true);
		},

		/**
		 * Handles closing confirmation dialog.
		 */
		handleCloseConfirmationDialog() {
			state.openConfirmationDialog.set(false);
		},

		/**
		 * Handles action when user changes date on Progress calendar.
		 * @param newDate the new date selected.
		 */
		handleOnDateChange(newDate: Date | null) {
			if (!newDate) return;

			state.set((prev) => ({
				...prev,
				selectedDate: newDate
			}));
		},

		/**
		 * Handles deleting workout.
		 * Will open confirmation dialog.
		 * @param workoutToDelete the workout to be deleted.
		 */
		handleDeleteWorkoutBeforeConfirmation(workoutToDelete: WorkoutType) {
			state.set((prev) => ({
				...prev,
				workoutToBeDeleted: workoutToDelete,
				openConfirmationDialog: true
			}));
		},

		/**
		 * Handles deleting workout after user confirms deletion.
		 */
		async handleDeleteWorkoutAfterConfirmation() {
			try {
				await deleteWorkout(this.workoutToDelete!.id);
				state.openConfirmationDialog.set(false);
				snackbarState.handleOpenSnackbar(
					`Workout: ${this.workoutToDelete!.name} has been successfully deleted.`
				);
			} catch (e) {
				snackbarState.handleOpenSnackbar(
					`Something went wrong. Workout: ${
						this.workoutToDelete!.name
					} could not be deleted.`
				);
			}
		}
	};
};
