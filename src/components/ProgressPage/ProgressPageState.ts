import { createState, useHookstate } from "@hookstate/core";
import { UserType } from "../../firebase/User";
import { WorkoutType, deleteWorkout } from "../../firebase/Workout";
import { useSnackbarState } from "../../states/SnackbarState";
import { useUserState } from "../../states/UserState";

type ProgressPageState = {
	openConfirmationDialog: boolean;
	workoutToDelete: WorkoutType | null;
	workoutsOnThisDay: WorkoutType[];
};

const progressPageState = createState({
	openConfirmationDialog: false,
	workoutToDelete: null,
	workoutsOnThisDay: []
} as ProgressPageState);

export const useProgressPageState = () => {
	const user = useUserState() as UserType;
	const state = useHookstate(progressPageState);
	const snackbarState = useSnackbarState();

	return {
		get openConfirmationDialog() {
			return state.openConfirmationDialog.get();
		},
		get workoutToDelete() {
			return state.workoutToDelete.get();
		},
		get workoutsOnThisDay() {
			return state.workoutsOnThisDay.get();
		},

		/**
		 * Initializes every time page is loaded.
		 */
		init() {
			state.set({
				openConfirmationDialog: false,
				workoutToDelete: null,
				workoutsOnThisDay: this.getWorkoutsOnDate(new Date())
			});
		},

		/**
		 * Returns list of workouts that user logged on the specified date.
		 * @param date Date object.
		 */
		getWorkoutsOnDate(date: Date) {
			return user.workouts.filter(
				(workout: WorkoutType) =>
					new Date(workout.dateCreated).toDateString() === date.toDateString()
			);
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
		handleOnDateChange(newDate: Date) {
			state.set((prev) => ({
				...prev,
				workoutsOnThisDay: this.getWorkoutsOnDate(newDate)
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
