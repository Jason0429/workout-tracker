import { exercises } from "../data/exercises";
import { ExerciseType } from "./Exercise";
import { TemplateType } from "./Template";
import { WorkoutType } from "./Workout";
import FirebaseObject from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type UserType = {
	id: string;
	email: string | null;
	photoURL: string | null;
	name: string | null;
	workouts: WorkoutType[];
	templates: TemplateType[];
	exercises: ExerciseType[];
};

export const NewUser = (
	id: string,
	email: string | null,
	photoURL: string | null,
	name: string | null
): UserType => ({
	id,
	email,
	photoURL,
	name,
	workouts: [],
	templates: [],
	exercises
});

/**
 * Returns current logged in user object.
 */
export const getUser = async (): Promise<UserType> => {
	const fb = new FirebaseObject();
	try {
		const userId = fb.auth.currentUser!.uid;
		return (await getDoc(doc(fb.db, "users", userId))).data() as UserType;
	} catch (e) {
		throw new Error("Could not get user.");
	}
};

/**
 * Adds user object to users collection in firestore.
 * @param user the user object to be added.
 */
export const addNewUser = async () => {
	const fb = new FirebaseObject();
	const currentUser = fb.auth.currentUser;
	if (!currentUser) throw new Error("Could not add user.");

	try {
		const newUser = NewUser(
			currentUser.uid,
			currentUser.email,
			currentUser.photoURL,
			currentUser.displayName
		);
		return await setDoc(doc(fb.db, "users", currentUser.uid), newUser);
	} catch (e) {
		throw new Error("Could not add user.");
	}
};

/**
 * Checks if user already exists in firestore.
 * @param id user id.
 */
export const userExistsInDB = async (id: string): Promise<Boolean> => {
	const fb = new FirebaseObject();
	return (await getDoc(doc(fb.db, "users", id))).exists();
};
