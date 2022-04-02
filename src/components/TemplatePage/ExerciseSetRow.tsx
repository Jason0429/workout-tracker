import { Input, Stack } from "@mui/material";
import { useStyles } from "../../styles/classes";
import CloseIcon from "@mui/icons-material/Close";
import { Set, SetType } from "../../firebase/Set";
import { useTemplatePageState } from "./TemplatePageState";
import { useThemeState } from "../../states/ThemeState";

type Props = {
	exerciseIdx: number;
	setIdx: number;
	set: SetType;
};

function ExerciseSetRow({ exerciseIdx, setIdx, set }: Props) {
	const theme = useThemeState();
	const templatePageState = useTemplatePageState();
	const classes = useStyles();

	return (
		<>
			<Stack direction='row' justifyContent='space-evenly' alignItems='center'>
				<div
					className={classes.setNumber}
					style={{
						color: theme.text,
						transition: theme.transition
					}}
				>
					{setIdx + 1}
				</div>
				<Input
					className={classes.setDetailInput}
					name='reps'
					type='number'
					value={set?.reps}
					inputProps={{ min: 0 }}
					onChange={(e) => templatePageState.handleEditSetDetail(e, exerciseIdx, setIdx)}
					sx={{
						color: theme.text,
						transition: theme.transition
					}}
				/>
				<Input
					className={classes.setDetailInput}
					name='lbs'
					type='number'
					value={set?.lbs}
					inputProps={{ min: 0 }}
					onChange={(e) => templatePageState.handleEditSetDetail(e, exerciseIdx, setIdx)}
					sx={{
						color: theme.text,
						transition: theme.transition
					}}
				/>
				<Input
					className={classes.setDetailInput}
					name='rpe'
					type='number'
					value={set?.rpe}
					inputProps={{ min: 0, max: 10 }}
					onChange={(e) => templatePageState.handleEditSetDetail(e, exerciseIdx, setIdx)}
					sx={{
						color: theme.text,
						transition: theme.transition
					}}
				/>
				<div
					className={classes.closeIconContainer}
					onClick={() => templatePageState.handleDeleteSet(exerciseIdx, setIdx)}
				>
					<CloseIcon className={classes.closeIcon} />
				</div>
			</Stack>
		</>
	);
}

export default ExerciseSetRow;
