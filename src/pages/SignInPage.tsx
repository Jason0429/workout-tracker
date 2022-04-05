// Material
import { Stack } from "@mui/material";

// Components
import GoogleSignInButton from "../components/Global/GoogleSignInButton";

// Firebase
import FirebaseObject from "../firebase/firebase";

function SignInPage() {
	/**
	 * Handles sign in with google.
	 */
	const handleSignInUser = () => {
		const firebaseObj = new FirebaseObject();
		firebaseObj.signInWithGoogle();
	};

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
