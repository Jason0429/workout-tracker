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

// Contexts
import UserContext from "./contexts/userContext";
import ThemeContext from "./contexts/themeContext";
import { themes } from "./styles/theme";
import SnackbarContext from "./contexts/snackbarContext";

import { SnackbarType, ThemeType, UserType } from "./models";

export default function App() {
	const [user, setUser] = useState(null as UserType | null);
	const themeMode = localStorage.getItem("themeMode") ?? "light";
	const [theme, setTheme] = useState(themes[themeMode] as ThemeType);
	const [snackbar, setSnackbar] = useState({ open: false, message: "" } as SnackbarType);
	const [initializing, setInitializing] = useState(true);
	const classes = useStyles();
	const firebaseObj = new FirebaseObject();

	/**
	 * Handles signing in and out of Google.
	 */
	useEffect(() => {
		const unsub = onAuthStateChanged(firebaseObj.auth, async (authUser: User | null) => {
			// Signing in process
			if (authUser) {
				try {
					// If user already exists in DB:
					const existingUser: UserType = await firebaseObj.getUser();
					console.log("User exists");
					setUser(existingUser);
				} catch (e) {
					// If user does not exist in DB:
					try {
						// Create new user in database then update state to new user.
						firebaseObj.createNewUser(authUser).then((newUser: UserType) => {
							setUser(newUser);
						});
					} catch (e) {
						// If user is unable to be created in the database.
						alert("Something went wrong. Please try again.");
					}
				}
			} else {
				// Signing out process
				// Update user state to null
				setUser(null);
			}

			// Disable loading screen
			if (initializing) setInitializing(false);
		});

		// return subscriber;
		return () => unsub();
	}, []); // DO NOT REMOVE []

	useEffect(() => {
		// If user is logged in.
		if (user) {
			// If this user was modified in database:
			const userDoc = doc(firebaseObj.db, "users", user?.id);

			const unsub = onSnapshot(userDoc, (doc) => {
				console.log("User modified: ", doc.data() as UserType);
				setUser(doc.data() as UserType);
			});

			return () => unsub();
		}
	}, [initializing]); // DO NOT REMOVE initializing dependency

	/**
	 * Handles closing the snackbar.
	 */
	function handleCloseSnackbar() {
		setSnackbar((prev: SnackbarType) => ({
			...prev,
			open: false,
			message: ""
		}));
	}

	if (initializing)
		return (
			<div
				className={classes.mainContainer}
				style={{
					background: theme.background,
					transition: theme.transition,
					color: theme.text
				}}
			>
				{"Loading..."}
			</div>
		);

	return (
		<ThemeContext.Provider value={[theme, setTheme]}>
			<UserContext.Provider value={[user, setUser]}>
				<SnackbarContext.Provider value={[snackbar, setSnackbar]}>
					<BrowserRouter basename={process.env.PUBLIC_URL + "/"}>
						<div
							className={classes.mainContainer}
							style={{
								background: theme.background,
								transition: theme.transition
							}}
						>
							<Navbar />
							<Routes>
								{/* Create Template Page */}
								<Route
									path={"/createTemplate"}
									element={
										user ? (
											<TemplatePage mode='create-template' />
										) : (
											<Navigate to={"/signin"} />
										)
									}
								/>

								{/* Edit Template Page */}
								<Route
									path={"/editTemplate/:id"}
									element={
										user ? (
											<TemplatePage mode='edit-template' />
										) : (
											<Navigate to={"/signin"} />
										)
									}
								/>

								{/* Create Workout to Log */}
								<Route
									path={"/createWorkout"}
									element={
										user ? (
											<TemplatePage mode='create-workout' />
										) : (
											<Navigate to={"/signin"} />
										)
									}
								/>

								{/* Edit Logged Workout */}
								<Route
									path={"/editWorkout/:id"}
									element={
										user ? (
											<TemplatePage mode='edit-workout' />
										) : (
											<Navigate to={"/signin"} />
										)
									}
								/>

								{/* Log Workout */}
								<Route
									path={"/logWorkout/:id"}
									element={
										user ? (
											<TemplatePage mode='log-workout' />
										) : (
											<Navigate to={"/signin"} />
										)
									}
								/>

								{/* View Progress Page*/}
								<Route
									path={"/progress"}
									element={user ? <ProgressPage /> : <Navigate to={"/signin"} />}
								/>

								{/* My Exercises Page */}
								<Route
									path={"/exercises"}
									element={
										user ? <MyExercisesPage /> : <Navigate to={"/signin"} />
									}
								/>

								{/* Log Workout Page*/}
								<Route
									path={"/log"}
									element={
										user ? <LogWorkoutPage /> : <Navigate to={"/signin"} />
									}
								/>

								{/* Home page, redirects to SignInPage */}
								<Route
									path={"/home"}
									element={user ? <HomePage /> : <Navigate to={"/signin"} />}
								/>

								{/* If user's logged in, redirect to HomePage, else sign in */}
								<Route
									path={"/signin"}
									element={user ? <Navigate to={"/home"} /> : <SignInPage />}
								/>
								{/* Any other path */}
								<Route
									path='/*'
									element={
										user ? (
											<Navigate to={"/home"} />
										) : (
											<Navigate to={"/signin"} />
										)
									}
								/>
							</Routes>
							{user && (
								<Snackbar
									open={snackbar.open}
									autoHideDuration={3000}
									// onClose={() => dispatch(closeSnackbar())}
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
				</SnackbarContext.Provider>
			</UserContext.Provider>
		</ThemeContext.Provider>
	);
}
