// Material
import { Stack } from "@mui/material";

// Hooks
import { useWindowSize } from "../hooks";
import ConfirmationDialog from "../components/Global/ConfirmationDialog";
import { useHookstate } from "@hookstate/core";
import ProgressCalendar from "../components/Progress/ProgressCalendar";
import ProgressWorkoutsList from "../components/Progress/ProgressWorkoutsList";
import {
	getWorkoutsOnThisDay,
	globalProgressPage,
	handleCloseConfirmationDialog,
	handleDeleteWorkoutAfterConfirmation
} from "../states/ProgressPage.state";
import { useEffect, useState } from "react";
import { globalUser } from "../states/user.state";
import { UserType } from "../models";

function ProgressPage() {
	const [loading, setLoading] = useState(true);
	const [width] = useWindowSize();
	const progressPageState = useHookstate(globalProgressPage);
	const { openConfirmationDialog, workoutToBeDeleted } = progressPageState.get();
	const user = useHookstate(globalUser);

	useEffect(() => {
		if (loading) {
			const currDate = new Date();
			progressPageState.set({
				selectedDate: currDate,
				openConfirmationDialog: false,
				workoutsOnThisDay: getWorkoutsOnThisDay(user.value as UserType, currDate),
				workoutToBeDeleted: null
			});
			setLoading(false);
		}
	}, []);

	return (
		<>
			{/* Delete Workout Confirmation Dialog */}
			{workoutToBeDeleted && (
				<ConfirmationDialog
					open={openConfirmationDialog}
					onClose={handleCloseConfirmationDialog}
					title='Delete Workout?'
					message={
						<>
							Are you sure you want to delete{" "}
							<span style={{ fontWeight: "bold" }}>{workoutToBeDeleted.name}</span>
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
