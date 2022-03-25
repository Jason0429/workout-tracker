import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStyles } from "../styles/classes";
import { Template, Workout, TemplateType, WorkoutType, TemplateWorkoutType } from "../models";
import ExercisesDialog from "../components/Template/ExercisesDialog";
import { useHookstate } from "@hookstate/core";
import { globalTheme } from "../states/theme.state";
import { handleOpenSnackbar } from "../states/snackbar.state";
import { globalTemplatePage, init } from "../states/TemplatePage.state";
import WorkoutDetailsSection from "../components/Template/WorkoutDetailsSection";
import Controlbar from "../components/Template/Controlbar";
import LoadingPage from "./LoadingPage";
import { globalUser } from "../states/user.state";

interface Props {
	mode: "create-template" | "edit-template" | "create-workout" | "edit-workout" | "log-workout";
}

function TemplatePage({ mode }: Props) {
	const { id } = useParams();
	const navigate = useNavigate();
	const classes = useStyles();
	const user = useHookstate(globalUser);
	const theme = useHookstate(globalTheme);
	const templatePageState = useHookstate(globalTemplatePage);
	const [loading, setLoading] = useState(true);

	/**
	 * When page loads, set template or workout to find or make new.
	 */
	useEffect(() => {
		if (loading) {
			// Change to default every time this page loads.
			init();

			templatePageState.set({
				template: getTemplateOrWorkout(),
				title: getTitle(),
				mode,
				openExerciseDialog: false
			});

			setLoading(false);
		}
	}, []);

	/**
	 * Handles getting the proper title for the page.
	 */
	const getTitle = (): string => {
		if (mode === "create-template") return "Create a New Template";
		if (mode === "edit-template") return "Edit Template";
		if (mode === "log-workout") return "Log Workout";
		if (mode === "edit-workout") return "Edit Workout";
		if (mode === "create-workout") return "Create a New Workout";
		else return "";
	};

	/**
	 * Gets the proper template or workout.
	 */
	const getTemplateOrWorkout = (): TemplateWorkoutType => {
		const templateExists = user.value?.templates.some((t) => t.id === id);
		const workoutExists = user.value?.workouts.some((w) => w.id === id);

		const editTemplate = () => {
			if (!templateExists) {
				handleOpenSnackbar("Could not find template.");
				navigate("/createTemplate");
			}

			const findTemplate = user.value?.templates.find(
				(template: TemplateType) => template.id === id
			)!;

			return findTemplate;
		};

		const editWorkout = () => {
			if (!workoutExists) {
				handleOpenSnackbar("Could not find workout");
				navigate("/createTemplate");
			}

			const findWorkout = user.value?.workouts.find(
				(workout: WorkoutType) => workout.id === id
			)!;

			return findWorkout;
		};

		const logWorkout = () => {
			if (!templateExists) {
				handleOpenSnackbar("Could not find template.");
				navigate("/createTemplate");
			}

			const workoutTemplate = user.value?.templates.find((t: TemplateType) => t.id === id)!;

			return Workout(workoutTemplate.name, workoutTemplate.exercises);
		};

		switch (mode) {
			case "create-template":
				return Template();
			case "edit-template":
				return editTemplate();
			case "create-workout":
				return Workout();
			case "edit-workout":
				return editWorkout();
			case "log-workout":
				return logWorkout();
			default:
				return Template(); // dummy value
		}
	};

	// If template/workout has not been loaded yet.
	if (loading) return <LoadingPage />;

	return (
		<div
			className={classes.mainContainer}
			style={{
				background: theme.value.background,
				transition: theme.value.transition
			}}
		>
			{/* Exercises Dialog */}
			<ExercisesDialog />

			{/* Workout Details Section */}
			<WorkoutDetailsSection />

			{/* Control Menu Bar */}
			<Controlbar />
		</div>
	);
}

export default TemplatePage;
