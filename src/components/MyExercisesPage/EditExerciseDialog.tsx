// React
import { useState, useEffect } from "react";

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
import { ExerciseType, updateExercise } from "../../firebase/Exercise";
import { useSnackbarState } from "../../states/SnackbarState";

interface Props {
	open: boolean;
	onClose: () => void;
	exercise: ExerciseType;
}
function EditExerciseDialog({ open, onClose, exercise }: Props) {
	const snackbar = useSnackbarState();
	const [newExercise, setNewExercise] = useState({ ...exercise });
	const [category, setCategory] = useState("");

	/**
	 * Every time a new exercise is selected to be edited,
	 * change newExercise to be edited.
	 */
	useEffect(() => {
		setNewExercise(exercise);
	}, [exercise]);

	/**
	 * Handles closing dialog.
	 */
	function handleClose() {
		onClose();
		setCategory("");
	}

	/**
	 * Handles change in new exercise name.
	 * @param {Event} e the TextField event.
	 */
	function handleExerciseName(e: React.ChangeEvent<any>) {
		setNewExercise((exercise: ExerciseType) => ({
			...exercise,
			name: e.target.value
		}));
	}

	/**
	 * Handles change in category text.
	 * @param {Event} e the TextField event.
	 */
	function handleCategory(e: React.ChangeEvent<any>) {
		setCategory(e.target.value);
	}

	/**
	 * Handles adding new category to exercise.
	 * @param {String} category the new category to be added to exercise.
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
	 * @param {Number} idx the index of the category to be deleted from exercise.
	 */
	function handleDeleteCategory(idx: number) {
		setNewExercise((exercise: ExerciseType) => ({
			...exercise,
			categories: exercise["categories"].filter((_, i: number) => i !== idx)
		}));
	}

	/**
	 * Handles updating exercise in database.
	 * @param updatedExercise updated exercise that will be updated in database.
	 */
	async function handleUpdateExercise(updatedExercise: ExerciseType) {
		try {
			await updateExercise(updatedExercise as ExerciseType);
			snackbar.handleOpenSnackbar(
				`Exercise: ${updatedExercise.name} has been successfully updated.`
			);
		} catch (e) {
			snackbar.handleOpenSnackbar(
				`Something went wrong. Exercise: ${updatedExercise.name} could not be updated.`
			);
		}
	}

	return (
		<>
			{exercise && (
				<Dialog open={open} onClose={handleClose} fullWidth>
					<DialogTitle>
						Edit <span style={{ color: "#0096FF" }}>{newExercise?.name}</span>
					</DialogTitle>
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
								onChange={handleCategory}
								sx={{
									width: "200px"
								}}
								variant='outlined'
								onKeyPress={(e: any) =>
									e.key === "Enter"
										? handleAddCategory(e.target.value.trim())
										: null
								}
							/>
							<Stack direction='row' gap={2} flexWrap='wrap'>
								{newExercise?.categories.map((c, idx) => (
									<Chip
										onDelete={() => handleDeleteCategory(idx)}
										label={c}
										key={idx}
									/>
								))}
							</Stack>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Cancel</Button>
						<Button
							onClick={() => {
								handleUpdateExercise(newExercise);
								handleClose();
							}}
							variant='outlined'
						>
							Save
						</Button>
					</DialogActions>
				</Dialog>
			)}
		</>
	);
}

export default EditExerciseDialog;
