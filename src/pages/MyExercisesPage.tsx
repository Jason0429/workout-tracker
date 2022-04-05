import AddExerciseDialog from "../components/MyExercisesPage/AddExerciseDialog";
import EditExerciseDialog from "../components/MyExercisesPage/EditExerciseDialog";
import ConfirmationDialog from "../components/Global/ConfirmationDialog";
import ListOfExercises from "../components/MyExercisesPage/ListOfExercises";
import Controlbar from "../components/MyExercisesPage/Controlbar";
import { useMyExercisesPageState } from "../components/MyExercisesPage/MyExercisesPageState";
import { useEffect, useState } from "react";
import LoadingPage from "./LoadingPage";

function MyExercisesPage() {
	const { ...state } = useMyExercisesPageState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (loading) {
			state.init();
			setLoading(false);
		}
	}, []);

	if (loading) return <LoadingPage />;

	return (
		<>
			{/* Confirmation Dialog */}
			{state.selectedExerciseToDelete && (
				<ConfirmationDialog
					open={state.openConfirmationDialog}
					onClose={state.handleCloseConfirmationDialog}
					title={`Delete ${state.selectedExerciseToDelete?.name}?`}
					message={
						<>
							Are you sure you want to delete{" "}
							<span style={{ fontWeight: "bold" }}>
								{state.selectedExerciseToDelete?.name}
							</span>
						</>
					}
					yesFunction={state.handleDeleteExerciseAfterConfirmation}
				/>
			)}

			{/* Add Exercise Dialog */}
			<AddExerciseDialog />

			{/* Edit Exercise Dialog */}
			{state.selectedExerciseToEdit && state.openEditExerciseDialog && <EditExerciseDialog />}

			{/* List of Exercises */}
			<ListOfExercises />

			{/* Control Bar */}
			<Controlbar />
		</>
	);
}

export default MyExercisesPage;
