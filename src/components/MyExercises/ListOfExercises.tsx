import { useHookstate } from "@hookstate/core";
import { Stack, Paper, Typography, List, ListItem, IconButton, ListItemText } from "@mui/material";
import { ExerciseType } from "../../models";
import { globalTheme } from "../../states/themeState";
import { globalUser } from "../../states/userState";
import { useStyles } from "../../styles/classes";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
	searchedExercise: string;
	setSearchedExercise: Function;
	handleOpenEditExerciseDialog: Function;
	handleDeleteExerciseBeforeConfirmation: Function;
}

function ListOfExercises({
	searchedExercise,
	setSearchedExercise,
	handleOpenEditExerciseDialog,
	handleDeleteExerciseBeforeConfirmation
}: Props) {
	const user = useHookstate(globalUser);
	const theme = useHookstate(globalTheme);
	const classes = useStyles();

	return (
		<Stack
			direction='column'
			sx={{
				margin: "20px 0 100px 0",
				width: "95%",
				maxWidth: "600px"
			}}
		>
			<Paper
				variant='outlined'
				sx={{
					width: "100%",
					background: theme.value.paperBackground,
					transition: theme.value.transition
				}}
			>
				<Paper
					sx={{
						padding: "10px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						background: theme.value.paperBackground,
						transition: theme.value.transition
					}}
				>
					<Typography
						variant='h6'
						sx={{
							transition: theme.value.transition,
							color: theme.value.text
						}}
					>
						My Exercises
					</Typography>
				</Paper>

				<Paper
					variant='outlined'
					sx={{
						padding: "15px",
						background: theme.value.background,
						transition: theme.value.transition
					}}
				>
					<input
						placeholder='Search for exercise'
						className={classes.roundInputField}
						value={searchedExercise}
						onChange={(e) => setSearchedExercise(e.target.value)}
						style={{
							background: theme.value.paperBackground,
							transition: theme.value.transition,
							color: theme.value.text
						}}
					/>
				</Paper>
				<List
					sx={{
						width: "100%",
						padding: "0"
					}}
				>
					{user.value?.exercises
						.sort((a: ExerciseType, b: ExerciseType) => {
							if (a.name < b.name) {
								return -1;
							} else if (a.name > b.name) {
								return 1;
							}
							return 0;
						})
						.filter((exercise: ExerciseType) =>
							exercise?.name.toLowerCase().includes(searchedExercise.toLowerCase())
						)
						.map((exercise: ExerciseType, idx: number) => (
							<ListItem
								divider
								sx={{
									background: theme.value.paperBackground,
									transition: theme.value.transition
								}}
								key={idx}
								secondaryAction={
									<Stack direction='row' alignItems='center' spacing={1}>
										<IconButton
											edge='end'
											aria-label='edit'
											// To edit exercise
											onClick={() => handleOpenEditExerciseDialog(exercise)}
										>
											<EditIcon
												sx={{
													transition: theme.value.transition,
													color: theme.value.text
												}}
											/>
										</IconButton>
										<IconButton
											edge='end'
											aria-label='delete'
											// To delete exercise
											onClick={() =>
												handleDeleteExerciseBeforeConfirmation(exercise)
											}
										>
											<DeleteIcon
												sx={{
													transition: theme.value.transition,
													color: theme.value.text
												}}
											/>
										</IconButton>
									</Stack>
								}
							>
								<ListItemText
									primary={exercise?.name}
									sx={{
										transition: theme.value.transition,
										color: theme.value.text
									}}
								/>
							</ListItem>
						))}
				</List>
			</Paper>
		</Stack>
	);
}

export default ListOfExercises;
