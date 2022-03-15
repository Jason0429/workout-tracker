import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Stack, Typography, IconButton, Tooltip } from "@mui/material";
import { useStyles } from "../styles/classes";
import {
	Template,
	Workout,
	TemplateType,
	WorkoutType,
	ExerciseType,
	SetType,
	TemplateWorkoutType,
	UserStateType,
	ThemeStateType,
	SnackbarStateType,
	UserType
} from "../models";
// import { useAppSelector, useAppDispatch } from "../../app/hooks";
// import { exercises } from "../data/exercises";
import ExercisesDialog from "../components/Template/ExercisesDialog";
import ExerciseTemplate from "../components/Template/ExerciseTemplate";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import ThemeContext from "../contexts/themeContext";
import UserContext from "../contexts/userContext";
import SnackbarContext from "../contexts/snackbarContext";
import FirebaseObject from "../firebase/firebase";

interface Props {
	mode: "create-template" | "edit-template" | "create-workout" | "edit-workout" | "log-workout";
}

function TemplatePage({ mode }: Props) {
	const { id } = useParams();
	const navigate = useNavigate();
	const [user] = useContext(UserContext) as UserStateType;
	const [theme] = useContext(ThemeContext) as ThemeStateType;
	const [snackbar, setSnackbar] = useContext(SnackbarContext) as SnackbarStateType;
	const classes = useStyles();
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const firebaseObj = new FirebaseObject();
	const [template, setTemplate] = useState<TemplateWorkoutType>(getTemplateOrWorkout());

	/**
	 * Gets the proper template or workout.
	 */
	function getTemplateOrWorkout(): TemplateWorkoutType {
		// If editing template or workout.
		// Return template or workout specified by id.
		try {
			if (mode === "create-template") {
				return Template() as TemplateType;
			} else if (mode === "edit-template") {
				const findTemplate = user?.templates.find((template) => template.id === id);
				return findTemplate as TemplateType;
			} else if (mode === "create-workout") {
				return Workout() as WorkoutType;
			} else if (mode === "edit-workout") {
				const findWorkout = user?.workouts.find((workout) => workout.id === id);
				return findWorkout as WorkoutType;
			}
			// Log Workout
			const workoutTemplate = user?.templates.find((t) => t.id === id) as TemplateType;

			// Create new workout with same name and exercises as template.
			return Workout(workoutTemplate.name, workoutTemplate.exercises);
		} catch (e) {
			// Redirect to create template page.
			navigate("/createTemplate");
			handleOpenSnackbar("Unable to find template.");
		}

		// If template/workout with id cannot be found.
		return Template();
	}

	/**
	 * Handles opening adding exercises dialog.
	 */
	function handleOpenDialog() {
		setOpenDialog(true);
	}

	/**
	 * Handles closing adding exercises dialog.
	 */
	function handleCloseDialog() {
		setOpenDialog(false);
	}

	/**
	 * Handles getting the proper title for the page.
	 */
	function getTitle() {
		if (mode === "create-template") return "Create a New Template";
		if (mode === "edit-template") return "Edit Template";
		if (mode === "log-workout") return "Log Workout";
		if (mode === "edit-workout") return "Edit Workout";
		if (mode === "create-workout") return "Create a New Workout";
	}

	/**
	 * Handles opening snackbar with message.
	 */
	function handleOpenSnackbar(message: string) {
		setSnackbar((prev) => ({
			...prev,
			open: true,
			message
		}));
	}

	/**
	 * Handles saving template/workout to database
	 * - Edit & Template: update template in db.
	 * - Edit & Workout: update workout in db.
	 * - !Edit & Template: add template to db.
	 * - !Edit & Workout: Add workout to db.
	 */
	async function handleSaveTemplate() {
		// If template name field is empty, ask user to type a name.
		if (template?.name.trim() === "") {
			handleOpenSnackbar(`Please enter a name.`);
			return;
		}

		if (mode === "create-template") {
			try {
				await firebaseObj.addTemplate(user as UserType, template as TemplateType);
				handleOpenSnackbar(`Template: ${template?.name} successfully added.`);
				navigate(-1);
			} catch (e) {
				handleOpenSnackbar(`Unable to add template: ${template?.name}.`);
			}
		}

		if (mode === "edit-template") {
			try {
				await firebaseObj.updateTemplate(user as UserType, template as TemplateType);
				handleOpenSnackbar(`Template: ${template?.name} successfully updated.`);
				navigate(-1);
			} catch (e) {
				handleOpenSnackbar(`Unable to update template: ${template?.name}.`);
			}
		}

		if (mode === "create-workout" || mode === "log-workout") {
			const workoutToAdd = Workout(template?.name, template?.exercises);
			try {
				await firebaseObj.addWorkout(user as UserType, workoutToAdd as WorkoutType);
				handleOpenSnackbar(`Workout: ${workoutToAdd.name} successfully added.`);
				navigate(-1);
			} catch (e) {
				handleOpenSnackbar(`Unable to add workout: ${workoutToAdd.name}.`);
			}
		}

		if (mode === "edit-workout") {
			try {
				console.log("EDITING");
				await firebaseObj.updateWorkout(user as UserType, template as WorkoutType);
				handleOpenSnackbar(`Workout: ${template?.name} successfully updated.`);
				navigate(-1);
			} catch (e) {
				handleOpenSnackbar(`Unable to update workout: ${template?.name}.`);
			}
		}
	}

	/**
	 * Handles adding exercise to template/workout.
	 * @param exercise the exercise chosen from dialog to be added to template/workout.
	 */
	function handleAddExercise(exercise: ExerciseType) {
		setTemplate((prev: TemplateWorkoutType) => ({
			...prev,
			exercises: [...prev.exercises, exercise]
		}));
	}

	/**
	 * Handles deleting exercise from template.
	 * @param {Number} exerciseIdx the index of the exercise template.
	 */
	function handleDeleteExercise(exerciseIdx: number) {
		setTemplate((prev: TemplateWorkoutType) => ({
			...prev,
			exercises: prev.exercises.filter((_, idx) => idx !== exerciseIdx)
		}));
	}

	/**
	 * Handles adding a set to exercise in template.
	 * @param {number} exerciseIdx the index of the exercise template.
	 */
	function handleAddSet(exerciseIdx: number) {
		setTemplate((prev: TemplateWorkoutType) => ({
			...prev,
			exercises: prev.exercises.map((exercise: ExerciseType, idx: number) =>
				idx === exerciseIdx
					? {
							...exercise,
							sets: [
								...exercise["sets"],
								// Copy previous set's details
								exercise["sets"][exercise["sets"].length - 1]
							]
					  }
					: exercise
			)
		}));
	}

	/**
	 * Handles deleting a set from an exercise in template.
	 * @param {number} exerciseIdx the index of the exercise template.
	 * @param {number} setIdx the index of the set.
	 */
	function handleDeleteSet(exerciseIdx: number, setIdx: number) {
		setTemplate((prev: TemplateWorkoutType) => ({
			...prev,
			exercises: prev.exercises.map((exercise: ExerciseType, idx: number) =>
				idx === exerciseIdx
					? {
							...exercise,
							sets: exercise["sets"].filter(
								(_: SetType, idx: number) => idx !== setIdx
							)
					  }
					: exercise
			)
		}));
	}

	/**
	 * Handles changing the reps, lbs, or rpe in a set.
	 * @param {Event} event the input event.
	 * @param {number} exerciseIdx the index of the exercise template.
	 * @param {number} setIdx the index of the set.
	 */
	function handleEditSetDetail(event: any, exerciseIdx: number, setIdx: number) {
		const type = event.target.name;
		const newValue = isNaN(event.target.value) ? 0 : parseInt(event.target.value);
		setTemplate((prev) => ({
			...prev,
			exercises: prev.exercises.map((exercise: ExerciseType, idx: number) =>
				idx === exerciseIdx
					? {
							...exercise,
							sets: exercise["sets"].map((set: SetType, idx: number) =>
								idx === setIdx
									? {
											...set,
											[type]: newValue
									  }
									: set
							)
					  }
					: exercise
			)
		}));
	}

	return (
		<div
			className={classes.mainContainer}
			style={{
				background: theme.background,
				transition: theme.transition
			}}
		>
			{/* Exercises Dialog */}
			<ExercisesDialog
				open={openDialog}
				handleCloseDialog={handleCloseDialog}
				handleAddExercise={handleAddExercise}
			/>

			{/* Workout Details Section */}
			<Stack direction='column' spacing={2} style={{ width: "350px", height: "100%" }}>
				<Typography
					variant='h6'
					textAlign='center'
					sx={{
						textAlign: "center",
						color: theme.text,
						transition: theme.transition
					}}
				>
					{/* Title of the page */}
					{getTitle()}
				</Typography>
				<Stack direction='column' spacing={3} alignItems='center'>
					{/* Template Name Input */}
					<input
						placeholder='Workout Name'
						className={classes.roundInputField}
						value={template?.name}
						onChange={(e) =>
							setTemplate((prev) => ({
								...prev,
								name: e.target.value
							}))
						}
						style={{
							background: theme.paperBackground,
							color: theme.text,
							transition: theme.transition
						}}
					/>
					{/* Render all exercises here */}
					<Stack direction='column' spacing={2} alignItems='center'>
						{/* Exercise Template */}
						{template?.exercises.map((e, idx) => (
							<ExerciseTemplate
								exercise={e}
								key={idx}
								exerciseIdx={idx}
								handleAddSet={handleAddSet}
								handleDeleteSet={handleDeleteSet}
								handleEditSetDetail={handleEditSetDetail}
								handleDeleteExercise={handleDeleteExercise}
							/>
						))}
					</Stack>
				</Stack>
			</Stack>

			{/* Control Menu Bar */}
			<Stack
				direction='row'
				sx={{
					position: "fixed",
					width: "100%",
					alignItems: "center",
					justifyContent: "center"
				}}
			>
				<Stack
					direction='row'
					className={classes.controlMenuBar}
					sx={{
						background: theme.paperBackground,
						transition: theme.transition
					}}
				>
					{/* Add Exercise Btn */}
					<Tooltip title='Add Exercise'>
						<IconButton size='small' onClick={handleOpenDialog}>
							<AddIcon className={classes.blueCircleBtn} fontSize='small' />
						</IconButton>
					</Tooltip>
					{/* Cancel Btn */}
					<Tooltip title='Cancel'>
						<IconButton size='small' onClick={() => navigate(-1)}>
							<CloseIcon className={classes.redCircleBtn} fontSize='small' />
						</IconButton>
					</Tooltip>
					{/* Save Template Btn */}
					<Tooltip title='Save'>
						<IconButton size='small' onClick={handleSaveTemplate}>
							<CheckIcon className={classes.greenCircleBtn} fontSize='small' />
						</IconButton>
					</Tooltip>
				</Stack>
			</Stack>
		</div>
	);
}

export default TemplatePage;
