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

interface Props {
	open: boolean;
	onClose: () => void;
}

function AddExerciseDialog({ open, onClose }: Props) {
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
		onClose();
	};

	/**
	 * Handles change in new exercise name.
	 * @param {Event} e the TextField event.
	 */
	const handleExerciseName = (e: React.ChangeEvent<any>) => {
		setNewExercise((exercise: ExerciseType) => ({
			...exercise,
			name: e.target.value
		}));
	};

	/**
	 * Handles adding new category to exercise.
	 * @param {string} category the new category to be added to exercise.
	 */
	const handleAddCategory = (category: string) => {
		if (category === "") return;

		setNewExercise((exercise: ExerciseType) => ({
			...exercise,
			categories: [...exercise["categories"], category]
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
			categories: exercise["categories"].filter((_, i: number) => i !== idx)
		}));
	};

	/**
	 * Handles adding custom exercise to user's list of exercises.
	 * @param customExercise custom exercise to be added.
	 */
	const handleAddCustomExercise = async () => {
		if (newExercise.name.trim() === "") {
			snackbar.handleOpenSnackbar("Please enter an exercise name");
			return;
		}

		const exerciseToBeAdded = {
			...newExercise,
			name: newExercise.name.trim()
		};

		// Check if exercise with this name already exists.
		if (user.exercises.some((e) => e.name === exerciseToBeAdded.name)) {
			snackbar.handleOpenSnackbar(`Exercise: ${exerciseToBeAdded.name} already exists.`);
			return;
		}

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
		<Dialog open={open} onClose={handleClose} fullWidth>
			<DialogTitle>Add New Exercise</DialogTitle>
			<DialogContent>
				<Stack direction='column' spacing={3}>
					<TextField
						// autoFocus
						margin='normal'
						label='Exercise Name'
						variant='outlined'
						value={newExercise?.name}
						onChange={handleExerciseName}
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
						{newExercise?.categories.map((c, idx) => (
							<Chip onDelete={() => handleDeleteCategory(idx)} label={c} key={idx} />
						))}
					</Stack>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleAddCustomExercise} variant='outlined'>
					Add
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default AddExerciseDialog;
