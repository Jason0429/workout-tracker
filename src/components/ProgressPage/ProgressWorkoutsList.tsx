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
import { useProgressPageState } from "./ProgressPageState";
import { WorkoutType } from "../../firebase/Workout";
import { useThemeState } from "../../states/ThemeState";

function ProgressWorkoutsList() {
	const { ...state } = useProgressPageState();
	const theme = useThemeState();
	const navigate = useNavigate();

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
				color={state.workoutsOnThisDay.length > 0 ? "#00bfff" : "#ff726f"}
			>
				{state.workoutsOnThisDay.length > 0
					? "Workouts On This Day:"
					: "No Workouts On This Day"}
			</Typography>
			<Divider />
			<List sx={{ width: "350px", padding: "0" }}>
				{state.workoutsOnThisDay.map((workout: WorkoutType, idx: number) => (
					<ListItem
						divider
						key={idx}
						secondaryAction={
							<IconButton
								edge='end'
								aria-label='delete'
								// To delete workout
								onClick={() => state.handleDeleteWorkoutBeforeConfirmation(workout)}
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
