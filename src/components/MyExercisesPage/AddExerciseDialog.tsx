// React
import { useState } from "react";

// Material
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Stack
} from "@mui/material";
import Chip from "@mui/material/Chip";

import { ExerciseType, Exercise, addExercise } from "../../firebase/Exercise";
import { useSnackbarState } from "../../states/SnackbarState";
import { useUserState } from "../../states/UserState";
import { UserType } from "../../firebase/User";
import { useMyExercisesPageState } from "./MyExercisesPageState";

function AddExerciseDialog() {
	const { ...state } = useMyExercisesPageState();
	const user = useUserState() as UserType;
	const snackbar = useSnackbarState();
	const [newExercise, setNewExercise] = useState(Exercise("", []));
	const [category, setCategory] = useState("");

	/**
	 * Handles closing dialog.
	 */
	const handleClose = () => {
		setNewExercise(Exercise("", []));
		setCategory("");
		state.handleCloseAddExerciseDialog();
	};

	/**
	 * Handles change in new exercise name.
	 * @param name the changed exercise name.
	 */
	const handleOnChangeExerciseName = (name: string) => {
		setNewExercise((exercise: ExerciseType) => ({
			...exercise,
			name
		}));
	};

	/**
	 * Handles adding new category to exercise.
	 * @param category the new category to be added to exercise.
	 */
	const handleAddCategory = (category: string) => {
		if (category === "") return;

		setNewExercise((exercise: ExerciseType) => ({
			...exercise,
			categories: [...exercise.categories, category]
		}));

		setCategory("");
	};

	/**
	 * Handles deleting category from exercise.
	 * - Takes index instead of category name to prevent deleting duplicates.
	 * @param {number} idx the index of the category to be deleted from exercise.
	 */
	const handleDeleteCategory = (idx: number) => {
		setNewExercise((exercise: ExerciseType) => ({
			...exercise,
			categories: exercise.categories.filter((_, i: number) => i !== idx)
		}));
	};

	/**
	 * Returns true if exercise with this name exists already.
	 * @param name the exercise name.
	 */
	const doesExerciseNameAlreadyExist = (name: string) => {
		return user.exercises.some((e) => e.name === name);
	};

	/**
	 * Handles adding custom exercise to user's list of exercises.
	 * @param customExercise custom exercise to be added.
	 */
	const handleAddNewExercise = async () => {
		if (newExercise.name.trim() === "") {
			return snackbar.handleOpenSnackbar("Please enter an exercise name");
		}

		if (doesExerciseNameAlreadyExist(newExercise.name.trim())) {
			return snackbar.handleOpenSnackbar(
				`Exercise: ${newExercise.name.trim()} already exists.`
			);
		}

		const exerciseToBeAdded = {
			...newExercise,
			name: newExercise.name.trim()
		};

		try {
			await addExercise(exerciseToBeAdded as ExerciseType);
			snackbar.handleOpenSnackbar(
				`Exercise: ${exerciseToBeAdded.name} has been successfully added.`
			);
		} catch (e) {
			snackbar.handleOpenSnackbar(
				`Something went wrong. Exercise: ${exerciseToBeAdded.name} could not be added added.`
			);
		}

		// Close the add exercise dialog.
		// Resets the new exercise.
		handleClose();
	};

	return (
		<Dialog open={state.openAddExerciseDialog} onClose={handleClose} fullWidth>
			<DialogTitle>Add New Exercise</DialogTitle>
			<DialogContent>
				<Stack direction='column' spacing={3}>
					<TextField
						// autoFocus
						margin='normal'
						label='Exercise Name'
						variant='outlined'
						value={newExercise.name}
						onChange={(e) => handleOnChangeExerciseName(e.target.value)}
						fullWidth
					/>
					<TextField
						label='New Category'
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						sx={{
							width: "200px"
						}}
						variant='outlined'
						onKeyPress={(e) => (e.key === "Enter" ? handleAddCategory(category) : null)}
					/>
					<Stack direction='row' gap={2} flexWrap='wrap'>
						{newExercise.categories.map((c, idx) => (
							<Chip onDelete={() => handleDeleteCategory(idx)} label={c} key={idx} />
						))}
					</Stack>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleAddNewExercise} variant='outlined'>
					Add
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default AddExerciseDialog;
