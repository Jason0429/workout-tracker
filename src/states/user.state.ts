import { createState } from "@hookstate/core";
import { User } from "firebase/auth";
import FirebaseObject from "../firebase/firebase";
import { ExerciseType, TemplateType, UserType, WorkoutType } from "../models";

export const globalUser = createState(null as UserType | null);

/**
 * Handles onAuthStateChanged event fires.
 * @param authUser google user.
 */
// export const handleOnAuthStateChanged = async (authUser: User | null) => {
// 	const firebaseObj = new FirebaseObject();
// 	// If user is signing in.
// 	if (authUser) {
// 		// If user already exists in database, log in with existing object.
// 		if (await firebaseObj.userExistsInDB()) {
// 			const existingUser = await firebaseObj.getUser();
// 			globalUser.set(existingUser);
// 			console.log("Existing user loaded: ", existingUser);
// 		} else {
// 			// Otherwise, create new user.
// 			const newUser = await firebaseObj.createNewUser(authUser);
// 			globalUser.set(newUser);
// 			console.log("New User loaded: ", newUser);
// 		}
// 	} else {
// 		// If user is signing out.
// 		globalUser.set(null);
// 		console.log("User signed out.");
// 	}
// };

export const addTemplate = async (template: TemplateType) => {
	if (globalUser.value) {
		const modifiedUser: UserType = {
			...globalUser.value,
			templates: [...globalUser.value.templates, template]
		};

		await new FirebaseObject().setUser(modifiedUser);
	}
};

export const addWorkout = async (workout: WorkoutType) => {
	if (globalUser.value) {
		const modifiedUser: UserType = {
			...globalUser.value,
			workouts: [...globalUser.value.workouts, workout]
		};

		await new FirebaseObject().setUser(modifiedUser);
	}
};

export const updateTemplate = async (template: TemplateType) => {
	if (globalUser.value) {
		const modifiedUser: UserType = {
			...globalUser.value,
			templates: globalUser.value.templates.map((t) => (t.id === template.id ? template : t))
		};

		await new FirebaseObject().setUser(modifiedUser);
	}
};

export const updateWorkout = async (workout: WorkoutType) => {
	if (globalUser.value) {
		const modifiedUser: UserType = {
			...globalUser.value,
			workouts: globalUser.value.workouts.map((w) => (w.id === workout.id ? workout : w))
		};

		await new FirebaseObject().setUser(modifiedUser);
	}
};

export const addCustomExercise = async (customExercise: ExerciseType) => {
	if (globalUser.value) {
		const modifiedUser: UserType = {
			...globalUser.value,
			exercises: [...globalUser.value.exercises, customExercise]
		};

		await new FirebaseObject().setUser(modifiedUser);
	}
};

export const deleteExercise = async (exerciseToBeDeleted: ExerciseType) => {
	if (globalUser.value) {
		const modifiedUser: UserType = {
			...globalUser.value,
			exercises: globalUser.value.exercises.filter((e) => e.id !== exerciseToBeDeleted.id)
		};

		await new FirebaseObject().setUser(modifiedUser);
	}
};

export const updateExercise = async (updatedExercise: ExerciseType) => {
	if (globalUser.value) {
		const modifiedUser: UserType = {
			...globalUser.value,
			exercises: globalUser.value.exercises.map((e) =>
				e.id === updatedExercise.id ? updatedExercise : e
			)
		};

		await new FirebaseObject().setUser(modifiedUser);
	}
};

export const deleteTemplate = async (template: TemplateType) => {
	if (globalUser.value) {
		const modifiedUser: UserType = {
			...globalUser.value,
			templates: globalUser.value.templates.filter((t) => t.id !== template.id)
		};

		await new FirebaseObject().setUser(modifiedUser);
	}
};

export const deleteWorkout = async (workoutToBeDeleted: WorkoutType) => {
	if (globalUser.value) {
		const modifiedUser: UserType = {
			...globalUser.value,
			workouts: globalUser.value.workouts.filter((w) => w.id !== workoutToBeDeleted.id)
		};

		await new FirebaseObject().setUser(modifiedUser);
	}
};
