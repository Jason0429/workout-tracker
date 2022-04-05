import { ExerciseType } from "./Exercise";
import { v4 as uuidv4 } from "uuid";
import { doc, updateDoc } from "firebase/firestore";
import FirebaseObject from "../firebase/firebase";
import { getUser } from "./User";

export type WorkoutType = {
	name: string;
	exercises: ExerciseType[];
	dateCreated: number;
	id: string;
};

export const Workout = (
	name?: string,
	exercises?: ExerciseType[],
	dateCreated?: number
): WorkoutType => ({
	name: name ?? "",
	exercises: exercises ?? [],
	dateCreated: dateCreated ?? Date.now(),
	id: uuidv4()
});

/**
 * Adds workout object to user's list of workouts.
 * @param workout the workout object to be added.
 */
export const addWorkout = async (workout: WorkoutType) => {
	const fb = new FirebaseObject();
	try {
		const userId = fb.auth.currentUser!.uid;
		const user = await getUser();
		const docPath = doc(fb.db, "users", userId);
		const updated = { workouts: [...user.workouts, workout] };
		await updateDoc(docPath, updated);
	} catch (e) {
		throw new Error("Could not add workout.");
	}
};

/**
 * Deletes workout with specified id.
 * @param id the workout id.
 */
export const deleteWorkout = async (id: string) => {
	const fb = new FirebaseObject();
	try {
		const userId = fb.auth.currentUser!.uid;
		const user = await getUser();
		const docPath = doc(fb.db, "users", userId);
		const updated = { workouts: user.workouts.filter((w) => w.id !== id) };
		await updateDoc(docPath, updated);
	} catch (e) {
		throw new Error("Could not delete workout.");
	}
};

/**
 * Updates workout with specified id.
 * @param id the workout id.
 */
export const updateWorkout = async (workout: WorkoutType) => {
	const fb = new FirebaseObject();
	try {
		const userId = fb.auth.currentUser!.uid;
		const user = await getUser();
		const docPath = doc(fb.db, "users", userId);
		const updated = {
			workouts: user.workouts.map((w) => (w.id === workout.id ? workout : w))
		};
		await updateDoc(docPath, updated);
	} catch (e) {
		throw new Error("Could not update workout.");
	}
};
