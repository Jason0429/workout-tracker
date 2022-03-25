// React
import { useEffect, useState } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Firebase
import FirebaseObject from "./firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

// Material
import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Styles
import { useStyles } from "./styles/classes";

// Components
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Global/Navbar";
import ProgressPage from "./pages/ProgressPage";
import MyExercisesPage from "./pages/MyExercisesPage";
import LogWorkoutPage from "./pages/LogWorkoutPage";
import TemplatePage from "./pages/TemplatePage";

import { UserType } from "./models";
import ViewWorkoutPage from "./pages/ViewWorkoutPage";
import { useHookstate } from "@hookstate/core";
import { globalTheme } from "./states/theme.state";
import { globalSnackbar, handleCloseSnackbar } from "./states/snackbar.state";
import { globalUser } from "./states/user.state";
import ProtectedRoute from "./components/Global/ProtectedRoute";
import LoadingPage from "./pages/LoadingPage";

export default function App() {
	const user = useHookstate(globalUser);
	const theme = useHookstate(globalTheme);
	const snackbar = useHookstate(globalSnackbar);
	const [loading, setLoading] = useState(true);
	const classes = useStyles();
	const firebaseObj = new FirebaseObject();

	/**
	 * Handles signing in and out of Google.
	 */
	useEffect(() => {
		const unsub = firebaseObj.auth.onAuthStateChanged(async (userObj: User | null) => {
			if (userObj) {
				console.log("Signing in");
				if (await firebaseObj.userExistsInDB()) {
					console.log("User exists in DB");
					user.set(await firebaseObj.getUser());
				} else {
					console.log("Creating new user in DB");
					user.set(await firebaseObj.createNewUser());
				}
			} else {
				console.log("Logged out");
				user.set(null);
			}

			if (loading) setLoading(false);
		});

		return () => unsub();
	}, []); // DO NOT REMOVE []

	/**
	 * Updates every time user was modified in database.
	 */
	useEffect(() => {
		if (!user.value) return;

		// If user is logged in.
		const userDoc = doc(firebaseObj.db, "users", user.value.id);
		const unsub = onSnapshot(userDoc, (doc) => {
			const userObj = doc.data() as UserType;
			user.set(userObj);
			console.log("(user) onSnapshot: ", userObj);
		});

		return () => unsub();
	}, [loading]); // DO NOT REMOVE loading dependency

	if (loading) return <LoadingPage />;

	return (
		<BrowserRouter basename='/'>
			<div
				className={classes.mainContainer}
				style={{
					background: theme.value.background,
					transition: theme.value.transition
				}}
			>
				<Navbar />
				<Routes>
					{/* View Workout Page (Uneditable) */}
					<ProtectedRoute path='/viewWorkout/:id' element={<ViewWorkoutPage />} />

					{/* Create Template Page */}
					<ProtectedRoute
						path='/createTemplate'
						element={<TemplatePage mode='create-template' />}
					/>

					{/* Edit Template Page */}
					<ProtectedRoute
						path='/editTemplate/:id'
						element={<TemplatePage mode='edit-template' />}
					/>

					{/* Create Workout to Log */}
					<ProtectedRoute
						path='/createWorkout'
						element={<TemplatePage mode='create-workout' />}
					/>

					{/* Edit Logged Workout */}
					<ProtectedRoute
						path='/editWorkout/:id'
						element={<TemplatePage mode='edit-workout' />}
					/>

					{/* Log Workout */}
					<ProtectedRoute
						path='/logWorkout/:id'
						element={<TemplatePage mode='log-workout' />}
					/>

					{/* View Progress Page*/}
					<ProtectedRoute path='/progress' element={<ProgressPage />} />

					{/* My Exercises Page */}
					<ProtectedRoute path='/exercises' element={<MyExercisesPage />} />

					{/* Log Workout Page*/}
					<ProtectedRoute path='/log' element={<LogWorkoutPage />} />

					{/* Home page, redirects to SignInPage */}
					<ProtectedRoute path='/home' element={<HomePage />} />

					{/* If user's logged in, redirect to HomePage, else sign in */}
					<Route
						path='/signin'
						element={user ? <Navigate to={"/home"} /> : <SignInPage />}
					/>

					{/* Any other path */}
					<Route
						path='/*'
						element={user ? <Navigate to={"/home"} /> : <Navigate to={"/signin"} />}
					/>
				</Routes>

				{user && (
					<Snackbar
						open={snackbar.value.open}
						autoHideDuration={snackbar.value.autoCloseDelay}
						onClose={handleCloseSnackbar}
						message={snackbar.value.message}
						action={
							<IconButton
								size='small'
								aria-label='close'
								color='inherit'
								onClick={handleCloseSnackbar}
							>
								<CloseIcon fontSize='small' />
							</IconButton>
						}
					/>
				)}
			</div>
		</BrowserRouter>
	);
}
