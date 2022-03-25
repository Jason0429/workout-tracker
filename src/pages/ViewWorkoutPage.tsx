import { Stack, Typography, IconButton, Paper, Divider, Tooltip } from "@mui/material";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";
import { ExerciseType, WorkoutType } from "../models";
import Spacer from "../components/Global/Spacer";
import { useHookstate } from "@hookstate/core";
import { globalUser } from "../states/user.state";
import { globalTheme } from "../states/theme.state";

function ViewWorkoutPage() {
	const { id } = useParams();
	const user = useHookstate(globalUser);
	const theme = useHookstate(globalTheme);
	const navigate = useNavigate();
	const workout = getWorkout();

	function getWorkout(): WorkoutType | undefined {
		return user.value?.workouts.find((w: WorkoutType) => w.id === id);
	}

	// If workout cannot be found.
	if (!workout) {
		return (
			<Stack
				sx={{
					height: "100vh",
					width: "100%",
					alignItems: "center",
					justifyContent: "center"
				}}
			>
				<Typography>Workout cannot be found.</Typography>
			</Stack>
		);
	}

	return (
		<Stack
			sx={{
				minHeight: "100vh",
				width: "100%",
				alignItems: "center",
				padding: "20px 0"
			}}
		>
			<Stack direction='column' sx={{ width: "350px" }}>
				<Stack
					direction='row'
					sx={{
						width: "100%",
						justifyContent: "space-between",
						alignItems: "center"
					}}
				>
					{/* Workout Name */}
					<Typography
						variant='h6'
						sx={{
							transition: theme.transition.value,
							color: theme.text.value
						}}
					>
						{workout?.name}
					</Typography>
					{/* Edit Option */}
					<Tooltip title='Edit workout'>
						<IconButton
							edge='end'
							aria-label='edit'
							size='small'
							onClick={() => navigate(`/editWorkout/${id}`)}
						>
							<EditIcon
								sx={{ transition: theme.transition.value, color: theme.text.value }}
							/>
						</IconButton>
					</Tooltip>
				</Stack>
				<Divider />
				<br />

				{workout?.exercises.map((e: ExerciseType) => (
					<Paper
						variant='outlined'
						sx={{
							width: "100%",
							margin: "5px 0",
							padding: "10px",
							boxSizing: "border-box",
							background: theme.paperBackground.value,
							transition: theme.transition.value
						}}
					>
						<Typography
							variant='body1'
							sx={{
								transition: theme.transition.value,
								color: theme.text.value
							}}
						>
							{e?.name}
						</Typography>
						<Divider />
						<Spacer width='100%' height='10px' />
						<Stack
							direction='row'
							sx={{
								justifyContent: "space-between",
								alignItems: "center",
								transition: theme.transition.value,
								color: theme.text.value
							}}
						>
							<Stack
								sx={{
									alignItems: "center",
									justifyContent: "center",
									width: "50px"
								}}
							>
								<Typography variant='subtitle1' fontWeight='bold'>
									Set
								</Typography>
							</Stack>
							<Stack
								sx={{
									alignItems: "center",
									justifyContent: "center",
									width: "50px"
								}}
							>
								<Typography variant='subtitle1' fontWeight='bold'>
									Reps
								</Typography>
							</Stack>
							<Stack
								sx={{
									alignItems: "center",
									justifyContent: "center",
									width: "50px"
								}}
							>
								<Typography variant='subtitle1' fontWeight='bold'>
									Lbs.
								</Typography>
							</Stack>
							<Stack
								sx={{
									alignItems: "center",
									justifyContent: "center",
									width: "50px"
								}}
							>
								<Typography variant='subtitle1' fontWeight='bold'>
									RPE
								</Typography>
							</Stack>
						</Stack>
						<Divider />
						{e?.sets.map((s, idx) => (
							<Stack
								direction='row'
								sx={{
									justifyContent: "space-between",
									alignItems: "center",
									transition: theme.transition.value,
									color: theme.text.value
								}}
							>
								<Stack
									sx={{
										alignItems: "center",
										justifyContent: "center",
										width: "50px"
									}}
								>
									<Typography variant='subtitle1'>{idx + 1}</Typography>
								</Stack>
								<Stack
									sx={{
										alignItems: "center",
										justifyContent: "center",
										width: "50px"
									}}
								>
									<Typography variant='subtitle1'>{s?.reps}</Typography>
								</Stack>
								<Stack
									sx={{
										alignItems: "center",
										justifyContent: "center",
										width: "50px"
									}}
								>
									<Typography variant='subtitle1'>{s?.lbs}</Typography>
								</Stack>
								<Stack
									sx={{
										alignItems: "center",
										justifyContent: "center",
										width: "50px"
									}}
								>
									<Typography variant='subtitle1'>{s?.rpe}</Typography>
								</Stack>
							</Stack>
						))}
					</Paper>
				))}

				{/* Exercise name */}

				{/* Set #, Reps, lbs, rpe */}
			</Stack>
		</Stack>
	);
}

export default ViewWorkoutPage;
