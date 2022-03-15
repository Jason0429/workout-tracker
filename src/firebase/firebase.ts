import { firebaseApp } from "./config";
import { doc, Firestore, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { ExerciseType, TemplateType, UserType, WorkoutType } from "../models";
import { exercises } from "../data/exercises";

export default class FirebaseObject {
	db: Firestore = getFirestore(firebaseApp);
	auth: Auth = getAuth(firebaseApp);
	googleProvider: GoogleAuthProvider = new GoogleAuthProvider();

	async getUser(): Promise<UserType> {
		const user = this.auth.currentUser;

		if (user !== null) {
			const userObj = await getDoc(doc(this.db, "users", user.uid));
			const docData = userObj.data();

			if (docData === undefined) {
				throw new Error("No data found for selected user.");
			}

			return {
				id: docData.id,
				name: docData.name,
				email: docData.email,
				photoURL: docData.photoURL,
				workouts: docData.workouts,
				exercises: docData.exercises,
				templates: docData.templates
			};
		}

		throw new Error("No user found.");
	}

	async createNewUser(authUser: User): Promise<UserType> {
		const newUser: UserType = {
			id: authUser.uid,
			email: authUser.email,
			name: authUser.displayName,
			photoURL: authUser.photoURL,
			workouts: [],
			templates: [],
			exercises
		};

		// After successful registration, return the new user.
		const userToBeReturned = await this.setUser(authUser.uid, newUser);
		return userToBeReturned;
	}

	async signInWithGoogle() {
		await signInWithPopup(this.auth, this.googleProvider);
	}

	async setUser(id: string, user: UserType): Promise<UserType> {
		try {
			await setDoc(doc(this.db, "users", id), user);
			return user;
		} catch (e) {
			throw new Error("User could not be set in database.");
		}
	}

	async logout() {
		await signOut(this.auth);
	}

	async addTemplate(user: UserType, template: TemplateType): Promise<UserType> {
		const modifiedUser: UserType = {
			...user,
			templates: [...user.templates, template]
		};

		return this.setUser(user.id, modifiedUser);
	}

	async addWorkout(user: UserType, workout: WorkoutType): Promise<UserType> {
		const modifiedUser: UserType = {
			...user,
			workouts: [...user.workouts, workout]
		};

		return this.setUser(user.id, modifiedUser);
	}

	async updateTemplate(user: UserType, template: TemplateType): Promise<UserType> {
		const modifiedUser: UserType = {
			...user,
			templates: user.templates.map((t) => (t.id === template.id ? template : t))
		};

		return this.setUser(user.id, modifiedUser);
	}

	async updateWorkout(user: UserType, workout: WorkoutType): Promise<UserType> {
		const modifiedUser: UserType = {
			...user,
			workouts: user.workouts.map((w) => (w.id === workout.id ? workout : w))
		};

		return this.setUser(user.id, modifiedUser);
	}

	async addCustomExercise(user: UserType, customExercise: ExerciseType): Promise<UserType> {
		const modifiedUser: UserType = {
			...user,
			exercises: [...user.exercises, customExercise]
		};

		return this.setUser(user.id, modifiedUser);
	}

	async deleteExercise(user: UserType, exerciseToBeDeleted: ExerciseType): Promise<UserType> {
		const modifiedUser: UserType = {
			...user,
			exercises: user.exercises.filter((e) => e.id !== exerciseToBeDeleted.id)
		};

		return this.setUser(user.id, modifiedUser);
	}

	async updateExercise(user: UserType, updatedExercise: ExerciseType): Promise<UserType> {
		const modifiedUser: UserType = {
			...user,
			exercises: user.exercises.map((e) =>
				e.id === updatedExercise.id ? updatedExercise : e
			)
		};

		return this.setUser(user.id, modifiedUser);
	}

	async deleteTemplate(user: UserType, template: TemplateType): Promise<UserType> {
		const modifiedUser: UserType = {
			...user,
			templates: user.templates.filter((t) => t.id !== template.id)
		};

		return this.setUser(user.id, modifiedUser);
	}

	async deleteWorkout(user: UserType, workoutToBeDeleted: WorkoutType): Promise<UserType> {
		const modifiedUser: UserType = {
			...user,
			workouts: user.workouts.filter((w) => w.id !== workoutToBeDeleted.id)
		};

		return this.setUser(user.id, modifiedUser);
	}
}
