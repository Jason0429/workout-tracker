import { createState } from "@hookstate/core";
import {
	ExerciseType,
	SetType,
	Template,
	TemplateType,
	TemplateWorkoutType,
	Workout,
	WorkoutType
} from "../models";
import { handleOpenSnackbar } from "./snackbar.state";
import { addTemplate, addWorkout, updateTemplate, updateWorkout } from "./user.state";

type TemplatePageState = {
	template: TemplateWorkoutType;
	title: string;
	mode: string;
	openExerciseDialog: boolean;
};

const initialState = {
	template: Template(),
	mode: "",
	title: "",
	openExerciseDialog: false
};

export const globalTemplatePage = createState(initialState as TemplatePageState);

/**
 * Initializes initial state.
 */
export const init = () => {
	globalTemplatePage.set(initialState);
};

/**
 * Handles opening adding exercises dialog.
 */
export const handleOpenDialog = () => {
	globalTemplatePage.openExerciseDialog.set(true);
};

/**
 * Handles closing adding exercises dialog.
 */
export const handleCloseDialog = () => {
	globalTemplatePage.openExerciseDialog.set(false);
};

/**
 * Handles saving template/workout to database
 * - Edit & Template: update template in db.
 * - Edit & Workout: update workout in db.
 * - !Edit & Template: add template to db.
 * - !Edit & Workout: Add workout to db.
 */
export const handleSaveTemplate = async () => {
	const template = globalTemplatePage.value.template;
	const mode = globalTemplatePage.value.mode;

	// If template name field is empty, ask user to type a name.
	if (template.name.trim() === "") {
		handleOpenSnackbar(`Please enter a name.`);
		return;
	}

	if (mode === "create-template") {
		try {
			await addTemplate(template as TemplateType);
			handleOpenSnackbar(`Template: ${template.name} successfully added.`);
			// navigate(-1);
		} catch (e) {
			handleOpenSnackbar(`Unable to add template: ${template.name}.`);
		}
	}

	if (mode === "edit-template") {
		try {
			await updateTemplate(template as TemplateType);
			handleOpenSnackbar(`Template: ${template.name} successfully updated.`);
			// navigate(-1);
		} catch (e) {
			handleOpenSnackbar(`Unable to update template: ${template.name}.`);
		}
	}

	if (mode === "create-workout" || mode === "log-workout") {
		const workoutToAdd = Workout(template.name, template.exercises);
		try {
			await addWorkout(workoutToAdd);
			handleOpenSnackbar(`Workout: ${workoutToAdd.name} successfully added.`);
			// navigate(-1);
		} catch (e) {
			handleOpenSnackbar(`Unable to add workout: ${workoutToAdd.name}.`);
		}
	}

	if (mode === "edit-workout") {
		try {
			await updateWorkout(template as WorkoutType);
			handleOpenSnackbar(`Workout: ${template.name} successfully updated.`);
			// navigate(-1);
		} catch (e) {
			handleOpenSnackbar(`Unable to update workout: ${template.name}.`);
		}
	}
};

/**
 * Handles adding exercise to template/workout.
 * @param exercise the exercise chosen from dialog to be added to template/workout.
 */
export const handleAddExercise = (exercise: ExerciseType) => {
	globalTemplatePage.template.set((prev) => ({
		...prev,
		exercises: [...prev.exercises, exercise]
	}));
};

/**
 * Handles deleting exercise from template.
 * @param {Number} exerciseIdx the index of the exercise template.
 */
export const handleDeleteExercise = (exerciseIdx: number) => {
	globalTemplatePage.template.set((prev: TemplateWorkoutType) => ({
		...prev,
		exercises: prev.exercises.filter((_, idx) => idx !== exerciseIdx)
	}));
};

/**
 * Handles adding a set to exercise in template.
 * @param {number} exerciseIdx the index of the exercise template.
 */
export const handleAddSet = (exerciseIdx: number) => {
	globalTemplatePage.template.set((prev: TemplateWorkoutType) => ({
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
};

/**
 * Handles deleting a set from an exercise in template.
 * @param {number} exerciseIdx the index of the exercise template.
 * @param {number} setIdx the index of the set.
 */
export const handleDeleteSet = (exerciseIdx: number, setIdx: number) => {
	globalTemplatePage.template.set((prev: TemplateWorkoutType) => ({
		...prev,
		exercises: prev.exercises.map((exercise: ExerciseType, idx: number) =>
			idx === exerciseIdx
				? {
						...exercise,
						sets: exercise["sets"].filter((_: SetType, idx: number) => idx !== setIdx)
				  }
				: exercise
		)
	}));
};

/**
 * Handles changing the reps, lbs, or rpe in a set.
 * @param {Event} event the input event.
 * @param {number} exerciseIdx the index of the exercise template.
 * @param {number} setIdx the index of the set.
 */
export const handleEditSetDetail = (event: any, exerciseIdx: number, setIdx: number) => {
	const type = event.target.name;
	const newValue = isNaN(event.target.value) ? 0 : parseInt(event.target.value);
	globalTemplatePage.template.set((prev) => ({
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
};
