// React
import { useEffect, useState } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Firebase
import FirebaseObject from "./firebase/firebase";
import { User } from "firebase/auth";
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

import { addNewUser, getUser, userExistsInDB, UserType } from "./custom_objects/User";
import ViewWorkoutPage from "./pages/ViewWorkoutPage";
import { globalTheme } from "./states/ThemeState";
import { globalSnackbar, handleCloseSnackbar } from "./states/SnackbarState";
import { globalUser } from "./states/UserState";
import ProtectedRoute from "./components/Global/ProtectedRoute";
import LoadingPage from "./pages/LoadingPage";

export default function App() {
	const { ...theme } = globalTheme.get();
	const { ...snackbar } = globalSnackbar.get();
	const [loading, setLoading] = useState(true);
	const classes = useStyles();
	const fb = new FirebaseObject();

	/**
	 * Handles signing in and out of Google.
	 */
	useEffect(() => {
		const unsub = fb.auth.onAuthStateChanged(async (userObj: User | null) => {
			// return new FirebaseObject().logout()
			if (!userObj) {
				globalUser.set(null);
				console.log("Signing out.");
			} else {
				if (!(await userExistsInDB(userObj.uid))) {
					console.log("Creating a new user.");
					addNewUser();
				}
				console.log("Signing in.");
				globalUser.set(await getUser());
			}
			if (loading) setLoading(false);
		});

		return () => unsub();
	}, []); // DO NOT REMOVE []

	/**
	 * Updates every time user was modified in database.
	 */
	useEffect(() => {
		if (!globalUser.value) return;

		// If user is logged in.
		const userDoc = doc(fb.db, "users", globalUser.value.id);
		const unsub = onSnapshot(userDoc, (doc) => {
			const userData = doc.data() as UserType;
			globalUser.set(userData);
			console.log("(user) onSnapshot: ", userData);
		});

		return () => unsub();
	}, [loading]); // DO NOT REMOVE loading dependency

	if (loading) return <LoadingPage />;
	if (!globalUser.value) return <SignInPage />;

	return (
		<BrowserRouter basename='/'>
			<div
				className={classes.mainContainer}
				style={{
					background: theme.background,
					transition: theme.transition
				}}
			>
				<Navbar />
				<Routes>
					{/* View Workout Page (Uneditable) */}
					<Route
						path='/viewWorkout/:id'
						element={<ProtectedRoute element={<ViewWorkoutPage />} />}
					/>

					{/* Create Template Page */}
					<Route
						path='/createTemplate'
						element={
							<ProtectedRoute element={<TemplatePage mode='create-template' />} />
						}
					/>

					{/* Edit Template Page */}
					<Route
						path='/editTemplate/:id'
						element={<ProtectedRoute element={<TemplatePage mode='edit-template' />} />}
					/>

					{/* Create Workout to Log */}
					<Route
						path='/createWorkout'
						element={
							<ProtectedRoute element={<TemplatePage mode='create-workout' />} />
						}
					/>

					{/* Edit Logged Workout */}
					<Route
						path='/editWorkout/:id'
						element={<ProtectedRoute element={<TemplatePage mode='edit-workout' />} />}
					/>

					{/* Log Workout */}
					<Route
						path='/logWorkout/:id'
						element={<ProtectedRoute element={<TemplatePage mode='log-workout' />} />}
					/>

					{/* View Progress Page*/}
					<Route
						path='/progress'
						element={<ProtectedRoute element={<ProgressPage />} />}
					/>

					{/* My Exercises Page */}
					<Route
						path='/exercises'
						element={<ProtectedRoute element={<MyExercisesPage />} />}
					/>

					{/* Log Workout Page*/}
					<Route path='/log' element={<ProtectedRoute element={<LogWorkoutPage />} />} />

					{/* Home page */}
					<Route path='/home' element={<ProtectedRoute element={<HomePage />} />} />

					{/* If user's logged in, redirect to HomePage, else sign in */}
					<Route
						path='/signin'
						element={globalUser.value ? <Navigate to={"/home"} /> : <SignInPage />}
					/>

					{/* Any other path */}
					<Route
						path='/*'
						element={
							globalUser.value ? (
								<Navigate to={"/home"} />
							) : (
								<Navigate to={"/signin"} />
							)
						}
					/>
				</Routes>

				{globalUser.value && (
					<Snackbar
						open={snackbar.open}
						autoHideDuration={snackbar.autoCloseDelay}
						onClose={handleCloseSnackbar}
						message={snackbar.message}
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
