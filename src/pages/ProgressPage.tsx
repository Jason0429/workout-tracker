// Material
import { Stack } from "@mui/material";

// Hooks
import { useWindowSize } from "../hooks";
import ConfirmationDialog from "../components/Global/ConfirmationDialog";
import { useHookstate } from "@hookstate/core";
import ProgressCalendar from "../components/Progress/ProgressCalendar";
import ProgressWorkoutsList from "../components/Progress/ProgressWorkoutsList";
import {
	globalProgressPage,
	handleCloseConfirmationDialog,
	handleDeleteWorkoutAfterConfirmation
} from "../states/ProgressPage.state";
import { useEffect, useState } from "react";
import { init } from "../states/ProgressPage.state";

function ProgressPage() {
	const [loading, setLoading] = useState(true);
	const [width] = useWindowSize();
	const progressPageState = useHookstate(globalProgressPage);

	useEffect(() => {
		if (loading) {
			init();
			setLoading(false);
		}
	}, []);

	return (
		<>
			{/* Delete Workout Confirmation Dialog */}
			{progressPageState.workoutToBeDeleted.value && (
				<ConfirmationDialog
					open={progressPageState.openConfirmationDialog.value}
					onClose={handleCloseConfirmationDialog}
					title='Delete Workout?'
					message={
						<>
							Are you sure you want to delete{" "}
							<span style={{ fontWeight: "bold" }}>
								{progressPageState.workoutToBeDeleted.value?.name}
							</span>
						</>
					}
					yesFunction={handleDeleteWorkoutAfterConfirmation}
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
