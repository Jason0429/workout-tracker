// React
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Components
// import ConfirmationDialog from "../components/global/ConfirmationDialog";

// Material
import "react-calendar/dist/Calendar.css";
import { Typography, Stack, Divider } from "@mui/material";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { StaticDatePicker } from "@mui/lab";
// import { BrowserView, MobileView } from "react-device-detect";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemButton from "@mui/material/ListItemButton";

// Hooks
import { useWindowSize } from "../hooks";
import { SnackbarStateType, UserStateType, UserType, WorkoutType } from "../models";
import UserContext from "../contexts/userContext";
import ConfirmationDialog from "../components/Global/ConfirmationDialog";
import FirebaseObject from "../firebase/firebase";
import SnackbarContext from "../contexts/snackbarContext";

function ProgressPage() {
	const [user] = useContext(UserContext) as UserStateType;
	const [snackbar, setSnackbar] = useContext(SnackbarContext) as SnackbarStateType;
	const [width] = useWindowSize();
	const navigate = useNavigate();
	const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
	const [openConfirmationDialog, setOpenConfirmationDialog] = useState<boolean>(false);
	const [selectedWorkoutToDelete, setSelectedWorkoutToDelete] = useState<WorkoutType | null>(
		null
	);
	const [workoutsOnThisDay, setWorkoutsOnThisDay] = useState<WorkoutType[]>(
		getWorkoutsOnThisDay(selectedDate)
	);

	// Needed to update "Workouts On This Day"
	useEffect(() => {
		setWorkoutsOnThisDay(getWorkoutsOnThisDay(selectedDate));
	}, [selectedDate, user?.workouts]);

	/**
	 * Returns array of workouts on specified date.
	 * @param {Date} dateSelected the current date selected.
	 * @returns workouts on the specified date.
	 */
	function getWorkoutsOnThisDay(dateSelected: Date | null) {
		if (!dateSelected) {
			return [];
		}
		return (
			user?.workouts.filter(
				(workout: WorkoutType) =>
					new Date(workout.dateCreated).toDateString() === dateSelected.toDateString()
			) ?? []
		);
	}

	/**
	 * Handles opening snackbar with message.
	 * @param message message to be displayed.
	 */
	function handleOpenSnackbar(message: string) {
		setSnackbar((prev) => ({
			...prev,
			open: true,
			message
		}));
	}

	/**
	 * Handles deleting workout.
	 * Will open confirmation dialog.
	 * @param workoutToBeDeleted workout to be deleted.
	 */
	function handleDeleteWorkoutBeforeConfirmation(workoutToBeDeleted: WorkoutType) {
		setSelectedWorkoutToDelete(workoutToBeDeleted);
		setOpenConfirmationDialog(true);
	}

	/**
	 * Handles deleting workout after user confirms deletion.
	 */
	async function handleDeleteWorkoutAfterConfirmation() {
		try {
			const firebaseObj = new FirebaseObject();
			await firebaseObj.deleteWorkout(
				user as UserType,
				selectedWorkoutToDelete as WorkoutType
			);
			setOpenConfirmationDialog(false);
			handleOpenSnackbar(
				`Workout: ${selectedWorkoutToDelete?.name} has been successfully deleted.`
			);
		} catch (e) {
			handleOpenSnackbar(
				`Something went wrong. Workout: ${selectedWorkoutToDelete?.name} could not be deleted.`
			);
		}
	}

	return (
		<>
			{/* Delete Workout Confirmation Dialog */}
			{selectedWorkoutToDelete && (
				<ConfirmationDialog
					open={openConfirmationDialog}
					onClose={() => setOpenConfirmationDialog(false)}
					title='Delete Workout?'
					message={
						<>
							Are you sure you want to delete{" "}
							<span style={{ fontWeight: "bold" }}>
								{selectedWorkoutToDelete?.name}
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
				{/* Calendar */}
				<Paper
					variant='outlined'
					sx={{
						height: "fit-content",
						paddingBottom: "20px",
						width: "350px"
					}}
				>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<StaticDatePicker
							orientation='portrait'
							openTo='day'
							value={selectedDate}
							onChange={(newDate) => {
								setSelectedDate(newDate);
							}}
							renderInput={(params) => <TextField {...params} />}
						/>
					</LocalizationProvider>
				</Paper>
				{/* Workouts on this day list */}
				<Paper variant='outlined' sx={{ height: "fit-content", width: "350px" }}>
					<Typography
						align='center'
						p={1}
						color={workoutsOnThisDay.length > 0 ? "#00bfff" : "#ff726f"}
					>
						{workoutsOnThisDay.length > 0
							? "Workouts On This Day:"
							: "No Workouts On This Day"}
					</Typography>
					<Divider />
					<List sx={{ width: "350px", padding: "0" }}>
						{getWorkoutsOnThisDay(selectedDate).map(
							(workout: WorkoutType, idx: number) => (
								<ListItem
									divider
									key={idx}
									secondaryAction={
										<IconButton
											edge='end'
											aria-label='delete'
											// To delete workout
											onClick={() =>
												handleDeleteWorkoutBeforeConfirmation(workout)
											}
										>
											<DeleteIcon />
										</IconButton>
									}
								>
									<ListItemButton
										onClick={() => navigate(`/viewWorkout/${workout.id}`)}
										// onClick={() => navigate(`/editWorkout/${workout.id}`)}
									>
										<ListItemText primary={workout.name} />
									</ListItemButton>
								</ListItem>
							)
						)}
					</List>
				</Paper>
			</Stack>
		</>
	);
}

export default ProgressPage;
