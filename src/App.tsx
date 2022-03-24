// React
import { useEffect, useState, FC } from "react";

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

// Contexts
import UserContext from "./contexts/userContext";
import ThemeContext from "./contexts/themeContext";
import { themes } from "./styles/theme";
import SnackbarContext from "./contexts/snackbarContext";

import { SnackbarType, ThemeType, UserType } from "./models";
import ViewWorkoutPage from "./pages/ViewWorkoutPage";
import { useHookstate } from "@hookstate/core";
import { globalTheme } from "./states/themeState";
import { globalSnackbar, handleCloseSnackbar } from "./states/snackbarState";
import { globalUser, handleOnAuthStateChanged } from "./states/userState";
import ProtectedRoute from "./components/Global/ProtectedRoute";

export default function App(): JSX.Element {
	// const [user, setUser] = useState(null as UserType | null);
	// const [theme, setTheme] = useState(themes[themeMode] as ThemeType);
	// const [snackbar, setSnackbar] = useState({ open: false, message: "" } as SnackbarType);
	const theme = useHookstate(globalTheme);
	const snackbar = useHookstate(globalSnackbar);
	const user = useHookstate(globalUser);
	const [initializing, setInitializing] = useState(true);
	const classes = useStyles();
	const firebaseObj = new FirebaseObject();

	/**
	 * Handles signing in and out of Google.
	 */
	useEffect(() => {
		const unsub = onAuthStateChanged(firebaseObj.auth, async (authUser: User | null) => {
			handleOnAuthStateChanged(authUser);

			// Disable loading screen
			if (initializing) setInitializing(false);
		});

		return () => unsub();
	}, []); // DO NOT REMOVE []

	/**
	 * Updates every time user was modified in database.
	 */
	useEffect(() => {
		// If user is logged in.
		if (user.value) {
			const userDoc = doc(firebaseObj.db, "users", user.value.id);
			const unsub = onSnapshot(userDoc, (doc) => {
				user.set(doc.data() as UserType);
				console.log("User modified: ", doc.data() as UserType);
			});

			return () => unsub();
		}
	}, [initializing]); // DO NOT REMOVE initializing dependency

	if (initializing)
		return (
			<div
				className={classes.mainContainer}
				style={{
					background: theme.value.background,
					transition: theme.value.transition,
					color: theme.value.text
				}}
			>
				{"Loading..."}
			</div>
		);

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
