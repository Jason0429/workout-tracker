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
import { useHookstate } from "@hookstate/core";
import { globalTheme } from "../../states/theme.state";
import { WorkoutType } from "../../models";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {
	globalProgressPage,
	handleDeleteWorkoutBeforeConfirmation
} from "../../states/ProgressPage.state";

function ProgressWorkoutsList() {
	const { workoutsOnThisDay } = useHookstate(globalProgressPage);
	const theme = useHookstate(globalTheme);
	const navigate = useNavigate();

	return (
		<Paper
			variant='outlined'
			sx={{
				height: "fit-content",
				width: "350px",
				background: theme.paperBackground.value,
				transition: theme.transition.value
			}}
		>
			<Typography
				align='center'
				p={1}
				color={workoutsOnThisDay.length > 0 ? "#00bfff" : "#ff726f"}
			>
				{workoutsOnThisDay.value.length > 0
					? "Workouts On This Day:"
					: "No Workouts On This Day"}
			</Typography>
			<Divider />
			<List sx={{ width: "350px", padding: "0" }}>
				{workoutsOnThisDay.value.map((workout: WorkoutType, idx: number) => (
					<ListItem
						divider
						key={idx}
						secondaryAction={
							<IconButton
								edge='end'
								aria-label='delete'
								// To delete workout
								onClick={() => handleDeleteWorkoutBeforeConfirmation(workout)}
							>
								<DeleteIcon
									sx={{
										transition: theme.transition.value,
										color: theme.text.value
									}}
								/>
							</IconButton>
						}
					>
						<ListItemButton onClick={() => navigate(`/viewWorkout/${workout.id}`)}>
							<ListItemText
								primary={workout.name}
								sx={{
									transition: theme.transition.value,
									color: theme.text.value
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
