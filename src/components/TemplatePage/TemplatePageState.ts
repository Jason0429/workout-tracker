import { createState, useHookstate } from "@hookstate/core";
import { getAlertTitleUtilityClass } from "@mui/material";
import { ExerciseType } from "../../firebase/Exercise";
import { SetType } from "../../firebase/Set";
import {
	TemplateWorkoutType,
	Template,
	addTemplate,
	TemplateType,
	updateTemplate
} from "../../firebase/Template";
import { Workout, addWorkout, updateWorkout, WorkoutType } from "../../firebase/Workout";
import { useSnackbarState } from "../../states/SnackbarState";

export type TemplatePageState = {
	template: TemplateWorkoutType;
	title: string;
	mode: string;
	openExerciseDialog: boolean;
};

export const templatePageState = createState({
	template: Template(),
	mode: "",
	title: "",
	openExerciseDialog: false
} as TemplatePageState);

export const useTemplatePageState = () => {
	const state = useHookstate(templatePageState);
	const snackbarState = useSnackbarState();

	return {
		get template() {
			return state.template.get();
		},
		get mode() {
			return state.mode.get();
		},
		get title() {
			return state.title.get();
		},
		get openExerciseDialog() {
			return state.openExerciseDialog.get();
		},

		/**
		 * Initializes initial state.
		 */
		init(initialState: TemplatePageState) {
			state.set(initialState);
		},

		/**
		 * Handles changing template/workout name.
		 */
		handleChangeName(name: string) {
			state.template.set((prev) => ({
				...prev,
				name
			}));
		},

		/**
		 * Handles opening adding exercises dialog.
		 */
		handleOpenDialog() {
			state.openExerciseDialog.set(true);
		},

		/**
		 * Handles closing adding exercises dialog.
		 */
		handleCloseDialog() {
			state.openExerciseDialog.set(false);
		},

		/**
		 * Creates template.
		 */
		async createTemplate(): Promise<boolean> {
			try {
				await addTemplate(this.template as TemplateType);
				snackbarState.handleOpenSnackbar(
					`Template: ${this.template.name} successfully added.`
				);
				return true;
			} catch (e) {
				snackbarState.handleOpenSnackbar(`Unable to add template: ${this.template.name}.`);
				return false;
			}
		},

		/**
		 * Edits template.
		 */
		async editTemplate(): Promise<boolean> {
			try {
				await updateTemplate(this.template as TemplateType);
				snackbarState.handleOpenSnackbar(
					`Template: ${this.template.name} successfully updated.`
				);
				return true;
			} catch (e) {
				snackbarState.handleOpenSnackbar(
					`Unable to update template: ${this.template.name}.`
				);
				return false;
			}
		},

		/**
		 * Creates or logs workout.
		 */
		async createOrLogWorkout(): Promise<boolean> {
			const workoutToAdd = Workout(this.template.name, this.template.exercises);
			try {
				await addWorkout(workoutToAdd);
				snackbarState.handleOpenSnackbar(
					`Workout: ${workoutToAdd.name} successfully added.`
				);
				return true;
			} catch (e) {
				snackbarState.handleOpenSnackbar(`Unable to add workout: ${workoutToAdd.name}.`);
				return false;
			}
		},

		/**
		 * Edits workout.
		 */
		async editWorkout(): Promise<boolean> {
			try {
				await updateWorkout(this.template as WorkoutType);
				snackbarState.handleOpenSnackbar(
					`Workout: ${this.template.name} successfully updated.`
				);
				return true;
			} catch (e) {
				snackbarState.handleOpenSnackbar(
					`Unable to update workout: ${this.template.name}.`
				);
				return false;
			}
		},

		/**
		 * Handles saving template/workout to database
		 * - Edit & Template: update template in db.
		 * - Edit & Workout: update workout in db.
		 * - !Edit & Template: add template to db.
		 * - !Edit & Workout: Add workout to db.
		 */
		async handleSaveTemplate(): Promise<boolean> {
			// If template name field is empty, ask user to type a name.
			if (this.template.name.trim() === "") {
				snackbarState.handleOpenSnackbar(`Please enter a name.`);
				return false;
			}

			switch (this.mode) {
				case "create-template":
					return await this.createTemplate();
				case "edit-template":
					return await this.editTemplate();
				case "create-workout":
					return await this.createOrLogWorkout();
				case "log-workout":
					return await this.createOrLogWorkout();
				case "edit-workout":
					return await this.editWorkout();
				default:
					return false;
			}
		},

		/**
		 * Handles adding exercise to template/workout.
		 * @param exercise the exercise chosen from dialog to be added to template/workout.
		 */
		handleAddExercise(exercise: ExerciseType) {
			state.template.set((prev) => ({
				...prev,
				exercises: [...prev.exercises, exercise]
			}));
		},

		/**
		 * Handles deleting exercise from template.
		 * @param exerciseIdx the index of the exercise template.
		 */
		handleDeleteExercise(exerciseIdx: number) {
			state.template.set((prev) => ({
				...prev,
				exercises: prev.exercises.filter((_, idx) => idx !== exerciseIdx)
			}));
		},

		/**
		 * Handles adding a set to exercise in template.
		 * @param exerciseIdx the index of the exercise template.
		 */
		handleAddSet(exerciseIdx: number) {
			state.template.set((prev) => ({
				...prev,
				exercises: prev.exercises.map((exercise: ExerciseType, idx: number) =>
					idx === exerciseIdx
						? {
								...exercise,
								sets: [
									...exercise["sets"],
									// Copy previous set's details
									exercise["sets"][exercise["sets"].length - 1]
								]
						  }
						: exercise
				)
			}));
		},

		/**
		 * Handles deleting a set from an exercise in template.
		 * @param exerciseIdx the index of the exercise template.
		 * @param setIdx the index of the set.
		 */
		handleDeleteSet(exerciseIdx: number, setIdx: number) {
			state.template.set((prev) => ({
				...prev,
				exercises: prev.exercises.map((exercise: ExerciseType, idx: number) =>
					idx === exerciseIdx
						? {
								...exercise,
								sets: exercise["sets"].filter(
									(_: SetType, idx: number) => idx !== setIdx
								)
						  }
						: exercise
				)
			}));
		},

		/**
		 * Handles changing the reps, lbs, or rpe in a set.
		 * @param event the input event.
		 * @param exerciseIdx the index of the exercise template.
		 * @param setIdx the index of the set.
		 */
		handleEditSetDetail(event: any, exerciseIdx: number, setIdx: number) {
			const type = event.target.name;
			const newValue = isNaN(event.target.value) ? 0 : parseInt(event.target.value);
			state.template.set((prev) => ({
				...prev,
				exercises: prev.exercises.map((exercise: ExerciseType, idx: number) =>
					idx === exerciseIdx
						? {
								...exercise,
								sets: exercise["sets"].map((set: SetType, idx: number) =>
									idx === setIdx
										? {
												...set,
												[type]: newValue
										  }
										: set
								)
						  }
						: exercise
				)
			}));
		}
	};
};
