import { useEffect, useState } from "react";
import AddExerciseDialog from "../components/MyExercisesPage/AddExerciseDialog";
import EditExerciseDialog from "../components/MyExercisesPage/EditExerciseDialog";
import ConfirmationDialog from "../components/Global/ConfirmationDialog";
import ListOfExercises from "../components/MyExercisesPage/ListOfExercises";
import Controlbar from "../components/MyExercisesPage/Controlbar";
import { useMyExercisesPageState } from "../components/MyExercisesPage/MyExercisesPageState";

function MyExercisesPage() {
	const myExercisesPageState = useMyExercisesPageState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (loading) {
			myExercisesPageState.init();
			setLoading(false);
		}
	}, []);

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
							Are you sure you want to delete{" "}
							<span style={{ fontWeight: "bold" }}>
								{myExercisesPageState.selectedExerciseToDelete?.name}
							</span>
						</>
					}
					yesFunction={myExercisesPageState.handleDeleteExerciseAfterConfirmation}
				/>
			)}
			{/* Add Exercise Dialog */}
			<AddExerciseDialog />
			{/* Edit Exercise Dialog */}
			{myExercisesPageState.selectedExerciseToEdit && <EditExerciseDialog />}
			{/* List of Exercises */}
			<ListOfExercises />
			{/* Bottom Fixed Row */}
			<Controlbar />
		</>
	);
}

export default MyExercisesPage;
