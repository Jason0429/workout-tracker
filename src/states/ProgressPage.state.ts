import { createState } from "@hookstate/core";
import { UserType, WorkoutType } from "../models";
import { handleOpenSnackbar } from "./snackbar.state";
import { deleteWorkout } from "./user.state";

type ProgressPageState = {
	selectedDate: Date | null;
	openConfirmationDialog: boolean;
	workoutsOnThisDay: WorkoutType[];
	workoutToBeDeleted: WorkoutType | null;
};

const initialState: ProgressPageState = {
	selectedDate: new Date(),
	openConfirmationDialog: false,
	workoutsOnThisDay: [],
	workoutToBeDeleted: null
};

export const globalProgressPage = createState(initialState);

/**
 * Sets state back to default.
 */
export const init = () => {
	globalProgressPage.set(initialState);
};

/**
 * Handles opening confirmation dialog.
 */
export const handleOpenConfirmationDialog = () => {
	globalProgressPage.openConfirmationDialog.set(true);
};

/**
 * Handles closing confirmation dialog.
 */
export const handleCloseConfirmationDialog = () => {
	globalProgressPage.openConfirmationDialog.set(false);
};

/**
 * Returns array of workouts that user logged on specified date.
 * @param dateSelected
 */
export const getWorkoutsOnThisDay = (user: UserType, dateSelected: Date | null) => {
	if (!dateSelected) return [];

	return (
		user.workouts.filter(
			(workout: WorkoutType) =>
				new Date(workout.dateCreated).toDateString() === dateSelected.toDateString()
		) ?? []
	);
};

/**
 * Handles action when user changes date on Progress calendar.
 * @param newDate
 */
export const handleOnDateChange = (user: UserType, newDate: Date | null) => {
	if (!newDate) return;

	globalProgressPage.selectedDate.set(newDate);
	globalProgressPage.workoutsOnThisDay.set(getWorkoutsOnThisDay(user, newDate));
};

/**
 * Handles deleting workout.
 * Will open confirmation dialog.
 * @param workoutToBeDeleted
 */
export const handleDeleteWorkoutBeforeConfirmation = (workoutToBeDeleted: WorkoutType) => {
	globalProgressPage.workoutToBeDeleted.set(workoutToBeDeleted);
	handleOpenConfirmationDialog();
};

/**
 * Handles deleting workout after user confirms deletion.
 */
export const handleDeleteWorkoutAfterConfirmation = async () => {
	try {
		await deleteWorkout(globalProgressPage.workoutToBeDeleted.value as WorkoutType);
		handleCloseConfirmationDialog();

		handleOpenSnackbar(
			`Workout: ${globalProgressPage.workoutToBeDeleted.value?.name} has been successfully deleted.`
		);
	} catch (e) {
		handleOpenSnackbar(
			`Something went wrong. Workout: ${globalProgressPage.workoutToBeDeleted.value?.name} could not be deleted.`
		);
	}
};
