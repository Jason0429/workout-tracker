import {
	Stack,
	Paper,
	Typography,
	List,
	ListItem,
	IconButton,
	ListItemText
} from '@mui/material';
import { useThemeState } from '../../states/ThemeState';
import { useUserState } from '../../states/UserState';
import { useStyles } from '../../styles/classes';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ExerciseType } from '../../firebase/Exercise';
import { UserType } from '../../firebase/User';
import { useMyExercisesPageState } from './MyExercisesPageState';

function ListOfExercises() {
	const myExercisesPageState = useMyExercisesPageState();
	const user = useUserState() as UserType;
	const theme = useThemeState();
	const classes = useStyles();

	return (
		<Stack
			direction='column'
			sx={{
				margin: '20px 0 100px 0',
				width: '95%',
				maxWidth: '600px'
			}}>
			<Paper
				variant='outlined'
				sx={{
					width: '100%',
					background: theme.paperBackground,
					transition: theme.transition
				}}>
				<Paper
					sx={{
						padding: '10px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						background: theme.paperBackground,
						transition: theme.transition
					}}>
					<Typography
						variant='h6'
						sx={{
							transition: theme.transition,
							color: theme.text
						}}>
						My Exercises
					</Typography>
				</Paper>

				<Paper
					variant='outlined'
					sx={{
						padding: '15px',
						background: theme.background,
						transition: theme.transition
					}}>
					<input
						placeholder='Search for exercise'
						className={classes.roundInputField}
						value={myExercisesPageState.search}
						onChange={(e) =>
							myExercisesPageState.handleSearchOnChange(
								e.target.value
							)
						}
						style={{
							background: theme.paperBackground,
							transition: theme.transition,
							color: theme.text
						}}
					/>
				</Paper>
				<List
					sx={{
						width: '100%',
						padding: '0'
					}}>
					{user.exercises
						.map((e: ExerciseType) => e) // Have to make copy of array to prevent sort from mutating
						.sort((a: ExerciseType, b: ExerciseType) => {
							if (a.name < b.name) {
								return -1;
							} else if (a.name > b.name) {
								return 1;
							}
							return 0;
						})
						.filter((exercise: ExerciseType) =>
							exercise.name
								.toLowerCase()
								.includes(
									myExercisesPageState.search.toLowerCase()
								)
						)
						.map((exercise: ExerciseType, idx: number) => (
							<ListItem
								divider
								sx={{
									background: theme.paperBackground,
									transition: theme.transition
								}}
								key={idx}
								secondaryAction={
									<Stack
										direction='row'
										alignItems='center'
										spacing={1}>
										<IconButton
											edge='end'
											aria-label='edit'
											// To edit exercise
											onClick={() =>
												myExercisesPageState.handleOpenEditExerciseDialog(
													{ ...exercise } // Must use spread to avoid hookstate error 102
												)
											}>
											<EditIcon
												sx={{
													transition:
														theme.transition,
													color: theme.text
												}}
											/>
										</IconButton>
										<IconButton
											edge='end'
											aria-label='delete'
											// To delete exercise
											onClick={() =>
												myExercisesPageState.handleDeleteExerciseBeforeConfirmation(
													exercise
												)
											}>
											<DeleteIcon
												sx={{
													transition:
														theme.transition,
													color: theme.text
												}}
											/>
										</IconButton>
									</Stack>
								}>
								<ListItemText
									primary={exercise?.name}
									sx={{
										transition: theme.transition,
										color: theme.text
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
