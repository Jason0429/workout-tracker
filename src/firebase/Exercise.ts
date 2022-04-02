import { SetType } from "./Set";
import { v4 as uuidv4 } from "uuid";
import FirebaseObject from "./firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getUser } from "./User";

export type ExerciseType = {
	name: string;
	categories: string[];
	id: string;
	sets: SetType[];
};

export const Exercise = (name: string, categories: string[]): ExerciseType => ({
	name,
	categories,
	id: uuidv4(),
	sets: []
});

/**
 * Adds exercise object to user's list of exercises.
 * @param exercise the exercise object to be added.
 */
export const addExercise = async (exercise: ExerciseType) => {
	const fb = new FirebaseObject();
	try {
		const userId = fb.auth.currentUser!.uid;
		const user = await getUser();
		const docPath = doc(fb.db, "users", userId);
		const updated = { exercises: [...user.exercises, exercise] };
		await updateDoc(docPath, updated);
	} catch (e) {
		throw new Error("Could not add exercise.");
	}
};

/**
 * Deletes exercise with specified id.
 * @param id the exercise id.
 */
export const deleteExercise = async (id: string) => {
	const fb = new FirebaseObject();
	try {
		const userId = fb.auth.currentUser!.uid;
		const user = await getUser();
		const docPath = doc(fb.db, "users", userId);
		const updated = { exercises: user.exercises.filter((e) => e.id !== id) };
		await updateDoc(docPath, updated);
	} catch (e) {
		throw new Error("Could not delete exercise.");
	}
};

/**
 * Updates exercise with specified id.
 * @param id the exercise id.
 */
export const updateExercise = async (exercise: ExerciseType) => {
	const fb = new FirebaseObject();
	try {
		const userId = fb.auth.currentUser!.uid;
		const user = await getUser();
		const docPath = doc(fb.db, "users", userId);
		const updated = {
			exercises: user.exercises.map((e) => (e.id === exercise.id ? exercise : e))
		};
		await updateDoc(docPath, updated);
	} catch (e) {
		throw new Error("Could not update exercise.");
	}
};
