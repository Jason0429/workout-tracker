// Material
import { Stack } from "@mui/material";

// Hooks
import { useWindowSize } from "../hooks";
import ConfirmationDialog from "../components/Global/ConfirmationDialog";
import ProgressCalendar from "../components/ProgressPage/ProgressCalendar";
import ProgressWorkoutsList from "../components/ProgressPage/ProgressWorkoutsList";
import { useEffect, useState } from "react";
import { useProgressPageState } from "../components/ProgressPage/ProgressPageState";

function ProgressPage() {
	const { ...state } = useProgressPageState();
	const [loading, setLoading] = useState(true);
	const [width] = useWindowSize();

	useEffect(() => {
		if (loading) {
			state.init();
			setLoading(false);
		}
	}, []);

	return (
		<>
			{/* Delete Workout Confirmation Dialog */}
			{state.workoutToDelete && (
				<ConfirmationDialog
					open={state.openConfirmationDialog}
					onClose={state.handleCloseConfirmationDialog}
					title='Delete Workout?'
					message={
						<>
							Are you sure you want to delete{" "}
							<span style={{ fontWeight: "bold" }}>{state.workoutToDelete.name}</span>
						</>
					}
					yesFunction={state.handleDeleteWorkoutAfterConfirmation}
				/>
			)}

			<Stack
				direction={width >= 768 ? "row" : "column"}
				spacing={4}
				sx={{
					width: "100%",
					height: "100%",
					marginTop: "80px",
					marginBottom: "100px",
					alignItems: `${width >= 768 ? "" : "center"}`,
					justifyContent: `${width >= 768 ? "center" : ""}`
				}}
			>
				{/* Progress Calendar */}
				<ProgressCalendar />

				{/* Progress Workouts List */}
				<ProgressWorkoutsList />
			</Stack>
		</>
	);
}

export default ProgressPage;
