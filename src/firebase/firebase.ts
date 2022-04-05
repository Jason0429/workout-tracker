import { firebaseApp } from "./config";
import { Firestore, getFirestore } from "firebase/firestore";
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

export default class FirebaseObject {
	db: Firestore = getFirestore(firebaseApp);
	auth: Auth = getAuth(firebaseApp);
	googleProvider: GoogleAuthProvider = new GoogleAuthProvider();

	async signInWithGoogle() {
		await signInWithPopup(this.auth, this.googleProvider);
	}

	async logout() {
		await signOut(this.auth);
	}
}
