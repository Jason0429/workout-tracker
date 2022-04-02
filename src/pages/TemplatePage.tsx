import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStyles } from "../styles/classes";
import ExercisesDialog from "../components/TemplatePage/ExercisesDialog";
import WorkoutDetailsSection from "../components/TemplatePage/WorkoutDetailsSection";
import Controlbar from "../components/TemplatePage/Controlbar";
import LoadingPage from "./LoadingPage";
import { useUserState } from "../states/UserState";
import { useThemeState } from "../states/ThemeState";
import { useTemplatePageState } from "../components/TemplatePage/TemplatePageState";
import { TemplateWorkoutType, TemplateType, Template } from "../firebase/Template";
import { UserType } from "../firebase/User";
import { WorkoutType, Workout } from "../firebase/Workout";
import { useSnackbarState } from "../states/SnackbarState";

interface Props {
	mode: "create-template" | "edit-template" | "create-workout" | "edit-workout" | "log-workout";
}

function TemplatePage({ mode }: Props) {
	const { id } = useParams();
	const user = useUserState() as UserType;
	const theme = useThemeState();
	const snackbar = useSnackbarState();
	const templatePageState = useTemplatePageState();
	const navigate = useNavigate();
	const classes = useStyles();
	const [loading, setLoading] = useState(true);

	/**
	 * When page loads, set template or workout to find or make new.
	 */
	useEffect(() => {
		if (loading) {
			// Change to default every time this page loads.
			templatePageState.init({
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
		const templateExists = user.templates.some((t) => t.id === id);
		const workoutExists = user.workouts.some((w) => w.id === id);

		const editTemplate = () => {
			if (!templateExists) {
				snackbar.handleOpenSnackbar("Could not find template.");
				navigate("/createTemplate");
			}

			const findTemplate = user.templates.find(
				(template: TemplateType) => template.id === id
			)!;

			return findTemplate;
		};

		const editWorkout = () => {
			if (!workoutExists) {
				snackbar.handleOpenSnackbar("Could not find workout");
				navigate("/createTemplate");
			}

			const findWorkout = user.workouts.find((workout: WorkoutType) => workout.id === id)!;

			return findWorkout;
		};

		const logWorkout = () => {
			if (!templateExists) {
				snackbar.handleOpenSnackbar("Could not find template.");
				navigate("/createTemplate");
			}

			const workoutTemplate = user.templates.find((t: TemplateType) => t.id === id)!;

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
				background: theme.background,
				transition: theme.transition
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
