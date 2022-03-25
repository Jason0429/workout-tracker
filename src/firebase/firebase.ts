import { firebaseApp } from "./config";
import { doc, Firestore, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { ExerciseType, TemplateType, UserType, WorkoutType } from "../models";
import { exercises } from "../data/exercises";
import { serialize } from "v8";

export default class FirebaseObject {
	db: Firestore = getFirestore(firebaseApp);
	auth: Auth = getAuth(firebaseApp);
	googleProvider: GoogleAuthProvider = new GoogleAuthProvider();

	async setUser(user: UserType): Promise<UserType> {
		try {
			await setDoc(doc(this.db, "users", user.id), user);
			return user;
		} catch (e) {
			throw new Error("User could not be set in database.");
		}
	}

	async userExistsInDB(): Promise<boolean> {
		const currentUser = this.auth.currentUser;
		if (!currentUser) return false;
		return (await getDoc(doc(this.db, "users", currentUser.uid))).exists();
	}

	async getUser(): Promise<UserType> {
		const currentUser = this.auth.currentUser;

		if (!currentUser) throw new Error("No user signed in.");

		const userObj = (await getDoc(doc(this.db, "users", currentUser.uid))).data() as UserType;
		return userObj;
	}

	async createNewUser(): Promise<UserType> {
		const currentUser = this.auth.currentUser;

		if (!currentUser) throw new Error("No authenticated user logged in");

		const newUser: UserType = {
			id: currentUser.uid,
			email: currentUser.email,
			photoURL: currentUser.photoURL,
			name: currentUser.displayName,
			workouts: [],
			templates: [],
			exercises
		};

		// After successful registration, return the new user.
		return await this.setUser(newUser);
	}

	async signInWithGoogle() {
		await signInWithPopup(this.auth, this.googleProvider);
	}

	async logout() {
		await signOut(this.auth);
	}
}
