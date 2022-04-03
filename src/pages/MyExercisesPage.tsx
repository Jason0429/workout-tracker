import AddExerciseDialog from '../components/MyExercisesPage/AddExerciseDialog';
import EditExerciseDialog from '../components/MyExercisesPage/EditExerciseDialog';
import ConfirmationDialog from '../components/Global/ConfirmationDialog';
import ListOfExercises from '../components/MyExercisesPage/ListOfExercises';
import Controlbar from '../components/MyExercisesPage/Controlbar';
import { useMyExercisesPageState } from '../components/MyExercisesPage/MyExercisesPageState';
import { useEffect, useState } from 'react';
import LoadingPage from './LoadingPage';

function MyExercisesPage() {
	const myExercisesPageState = useMyExercisesPageState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (loading) {
			myExercisesPageState.init();
			setLoading(false);
		}
	}, []);

	if (loading) return <LoadingPage />;

	return (
		<>
			{/* Confirmation Dialog */}
			{myExercisesPageState.selectedExerciseToDelete && (
				<ConfirmationDialog
					open={myExercisesPageState.openConfirmationDialog}
					onClose={myExercisesPageState.handleCloseConfirmationDialog}
					title={`Delete ${myExercisesPageState.selectedExerciseToDelete?.name}?`}
					message={
						<>
							Are you sure you want to delete{' '}
							<span style={{ fontWeight: 'bold' }}>
								{
									myExercisesPageState
										.selectedExerciseToDelete?.name
								}
							</span>
						</>
					}
					yesFunction={
						myExercisesPageState.handleDeleteExerciseAfterConfirmation
					}
				/>
			)}
			{/* Add Exercise Dialog */}
			<AddExerciseDialog />
			{/* Edit Exercise Dialog */}
			{myExercisesPageState.selectedExerciseToEdit &&
				myExercisesPageState.openEditExerciseDialog && (
					<EditExerciseDialog />
				)}
			{/* List of Exercises */}
			<ListOfExercises />
			{/* Bottom Fixed Row */}
			<Controlbar />
		</>
	);
}

export default MyExercisesPage;
