// React
import { useState, useEffect } from 'react';

// Material
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Stack
} from '@mui/material';
import Chip from '@mui/material/Chip';
import { useMyExercisesPageState } from './MyExercisesPageState';

function EditExerciseDialog() {
	const myExercisesPageState = useMyExercisesPageState();

	const handleUpdateExercise = async () => {
		await myExercisesPageState.handleUpdateExercise();
		myExercisesPageState.handleCloseEditExerciseDialog();
	};

	return (
		<Dialog
			open={myExercisesPageState.openEditExerciseDialog}
			onClose={myExercisesPageState.handleCloseEditExerciseDialog}
			fullWidth>
			<DialogTitle>
				Edit{' '}
				<span style={{ color: '#0096FF' }}>
					{myExercisesPageState.selectedExerciseToEdit?.name}
				</span>
			</DialogTitle>
			<DialogContent>
				<Stack direction='column' spacing={3}>
					<TextField
						// autoFocus
						margin='normal'
						label='Exercise Name'
						variant='outlined'
						value={
							myExercisesPageState.selectedExerciseToEdit?.name
						}
						onChange={(e) =>
							myExercisesPageState.handleEditExerciseName(
								e.target.value
							)
						}
						fullWidth
					/>
					<TextField
						label='New Category'
						value={myExercisesPageState.category}
						onChange={(e) =>
							myExercisesPageState.handleSetCategory(
								e.target.value
							)
						}
						sx={{
							width: '200px'
						}}
						variant='outlined'
						onKeyPress={(e) =>
							e.key === 'Enter'
								? myExercisesPageState.handleAddCategory()
								: null
						}
					/>
					<Stack direction='row' gap={2} flexWrap='wrap'>
						{myExercisesPageState.selectedExerciseToEdit?.categories.map(
							(c, idx) => (
								<Chip
									onDelete={() =>
										myExercisesPageState.handleDeleteCategory(
											idx
										)
									}
									label={c}
									key={idx}
								/>
							)
						)}
					</Stack>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={
						myExercisesPageState.handleCloseEditExerciseDialog
					}>
					Cancel
				</Button>
				<Button onClick={handleUpdateExercise} variant='outlined'>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default EditExerciseDialog;
