import {
	Paper,
	Typography,
	Divider,
	List,
	ListItem,
	IconButton,
	ListItemButton,
	ListItemText
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProgressPageState } from "./ProgressPageState";
import { UserType } from "../../firebase/User";
import { WorkoutType } from "../../firebase/Workout";
import { useThemeState } from "../../states/ThemeState";
import { useUserState } from "../../states/UserState";

function ProgressWorkoutsList() {
	const progressPageState = useProgressPageState();
	const user = useUserState() as UserType;
	const theme = useThemeState();
	const navigate = useNavigate();
	const [workoutsOnThisDay, setWorkoutsOnThisDay] = useState<WorkoutType[]>(
		getWorkoutsOnThisDay()
	);

	useEffect(() => {
		setWorkoutsOnThisDay(getWorkoutsOnThisDay());
	}, [progressPageState.selectedDate]);

	/**
	 * Returns array of workouts that user logged on specified date.
	 */
	function getWorkoutsOnThisDay() {
		if (progressPageState.selectedDate) {
			const selectedDate = progressPageState.selectedDate;
			return user.workouts.filter(
				(workout: WorkoutType) =>
					new Date(workout.dateCreated).toDateString() === selectedDate.toDateString()
			);
		}
		return [];
	}

	return (
		<Paper
			variant='outlined'
			sx={{
				height: "fit-content",
				width: "350px",
				background: theme.paperBackground,
				transition: theme.transition
			}}
		>
			<Typography
				align='center'
				p={1}
				color={workoutsOnThisDay.length > 0 ? "#00bfff" : "#ff726f"}
			>
				{workoutsOnThisDay.length > 0 ? "Workouts On This Day:" : "No Workouts On This Day"}
			</Typography>
			<Divider />
			<List sx={{ width: "350px", padding: "0" }}>
				{workoutsOnThisDay.map((workout: WorkoutType, idx: number) => (
					<ListItem
						divider
						key={idx}
						secondaryAction={
							<IconButton
								edge='end'
								aria-label='delete'
								// To delete workout
								onClick={() =>
									progressPageState.handleDeleteWorkoutBeforeConfirmation(workout)
								}
							>
								<DeleteIcon
									sx={{
										transition: theme.transition,
										color: theme.text
									}}
								/>
							</IconButton>
						}
					>
						<ListItemButton onClick={() => navigate(`/viewWorkout/${workout.id}`)}>
							<ListItemText
								primary={workout.name}
								sx={{
									transition: theme.transition,
									color: theme.text
								}}
							/>
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Paper>
	);
}

export default ProgressWorkoutsList;
