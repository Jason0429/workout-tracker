// React
import React, { useContext, useState } from "react";

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

// Models
import { Exercise, ExerciseType, SnackbarStateType, UserStateType, UserType } from "../../models";
import SnackbarContext from "../../contexts/snackbarContext";
import FirebaseObject from "../../firebase/firebase";
import UserContext from "../../contexts/userContext";

interface Props {
	open: boolean;
	onClose: () => void;
}

function AddExerciseDialog({ open, onClose }: Props) {
	const [newExercise, setNewExercise] = useState(Exercise("", []));
	const [category, setCategory] = useState("");
	const [snackbar, setSnackbar] = useContext(SnackbarContext) as SnackbarStateType;
	const [user] = useContext(UserContext) as UserStateType;

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
	 * Handles closing dialog.
	 */
	function handleClose() {
		setNewExercise(Exercise("", []));
		setCategory("");
		onClose();
	}

	/**
	 * Handles change in new exercise name.
	 * @param {Event} e the TextField event.
	 */
	function handleExerciseName(e: React.ChangeEvent<any>) {
		setNewExercise((exercise) => ({
			...exercise,
			name: e.target.value
		}));
	}

	/**
	 * Handles adding new category to exercise.
	 * @param {string} category the new category to be added to exercise.
	 */
	function handleAddCategory(category: string) {
		if (category === "") return;

		setNewExercise((exercise: ExerciseType) => ({
			...exercise,
			categories: [...exercise["categories"], category]
		}));

		setCategory("");
	}

	/**
	 * Handles deleting category from exercise.
	 * - Takes index instead of category name to prevent deleting duplicates.
	 * @param {number} idx the index of the category to be deleted from exercise.
	 */
	function handleDeleteCategory(idx: number) {
		setNewExercise((exercise) => ({
			...exercise,
			categories: exercise["categories"].filter((_, i: number) => i !== idx)
		}));
	}

	/**
	 * Handles adding custom exercise to user's list of exercises.
	 * @param customExercise custom exercise to be added.
	 */
	async function handleAddCustomExercise() {
		if (newExercise.name.trim() === "") {
			handleOpenSnackbar("Please enter an exercise name");
			return;
		}

		const exerciseToBeAdded = {
			...newExercise,
			name: newExercise.name.trim()
		};

		// Check if exercise with this name already exists.
		if (user?.exercises.some((e) => e.name === exerciseToBeAdded?.name)) {
			handleOpenSnackbar(`Exercise: ${exerciseToBeAdded?.name} already exists.`);
			return;
		}

		try {
			const firebaseObj = new FirebaseObject();
			await firebaseObj.addCustomExercise(
				user as UserType,
				exerciseToBeAdded as ExerciseType
			);

			console.log(exerciseToBeAdded);

			handleOpenSnackbar(`Exercise: ${exerciseToBeAdded?.name} has been successfully added.`);
		} catch (e) {
			handleOpenSnackbar(
				`Something went wrong. Exercise: ${exerciseToBeAdded?.name} could not be added added.`
			);
		}

		// Close the add exercise dialog.
		// Resets the new exercise.
		handleClose();
	}

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
