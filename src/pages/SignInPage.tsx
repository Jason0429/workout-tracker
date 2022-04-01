// React
// import { useEffect, useState } from "react";

// Material
import { Stack } from "@mui/material";

// Components
import GoogleSignInButton from "../components/Global/GoogleSignInButton";

// Firebase
import FirebaseObject from "../firebase/firebase";
// import GoogleSignOutButton from "../Global/GoogleSignOutButton";

function SignInPage() {
	/**
	 * Handles sign in with google.
	 */
	function handleSignInUser() {
		const firebaseObj = new FirebaseObject();
		firebaseObj.signInWithGoogle();

		// onAuthStateChanged handles actions after user is logged in.
	}

	return (
		<Stack
			sx={{
				height: "100vh",
				width: "100%",
				justifyContent: "center",
				alignItems: "center"
			}}
		>
			<GoogleSignInButton onClick={handleSignInUser} />
		</Stack>
	);
}

export default SignInPage;
