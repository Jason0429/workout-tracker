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
import { useMyExercisesPageState } from "./MyExercisesPageState";

function EditExerciseDialog() {
	const { ...state } = useMyExercisesPageState();
	const [category, setCategory] = useState("");

	const handleUpdateExercise = async () => {
		await state.handleUpdateExercise();
		state.handleCloseEditExerciseDialog();
	};

	const handleAddCategory = () => {
		state.handleAddCategoryToEditExercise(category);
		setCategory("");
	};

	return (
		<Dialog
			open={state.openEditExerciseDialog}
			onClose={state.handleCloseEditExerciseDialog}
			fullWidth
		>
			<DialogTitle>
				Edit <span style={{ color: "#0096FF" }}>{state.selectedExerciseToEdit?.name}</span>
			</DialogTitle>
			<DialogContent>
				<Stack direction='column' spacing={3}>
					<TextField
						// autoFocus
						margin='normal'
						label='Exercise Name'
						variant='outlined'
						value={state.selectedExerciseToEdit?.name}
						onChange={(e) => state.handleEditExerciseName(e.target.value)}
						fullWidth
					/>
					<TextField
						label='New Category'
						// value={state.category}
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						// onChange={(e) => state.handleSetCategory(e.target.value)}
						sx={{
							width: "200px"
						}}
						variant='outlined'
						onKeyPress={(e) => (e.key === "Enter" ? handleAddCategory() : null)}
					/>
					<Stack direction='row' gap={2} flexWrap='wrap'>
						{state.selectedExerciseToEdit?.categories.map((c, idx) => (
							<Chip
								onDelete={() => state.handleDeleteCategory(idx)}
								label={c}
								key={idx}
							/>
						))}
					</Stack>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={state.handleCloseEditExerciseDialog}>Cancel</Button>
				<Button onClick={handleUpdateExercise} variant='outlined'>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default EditExerciseDialog;
