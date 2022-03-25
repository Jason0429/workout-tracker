import { Input, Stack } from "@mui/material";
import { SetType } from "../../models";
import { useStyles } from "../../styles/classes";
import CloseIcon from "@mui/icons-material/Close";
import { useHookstate } from "@hookstate/core";
import { globalTheme } from "../../states/theme.state";
import { handleDeleteSet, handleEditSetDetail } from "../../states/TemplatePage.state";

type Props = {
	exerciseIdx: number;
	setIdx: number;
	set: SetType;
	// handleDeleteSet: (exerciseIdx: number, setIdx: number) => void;
	// handleEditSetDetail: (event: any, exerciseIdx: number, setIdx: number) => void;
};

function ExerciseSetRow({ exerciseIdx, setIdx, set }: Props) {
	const classes = useStyles();
	const theme = useHookstate(globalTheme);

	return (
		<>
			<Stack direction='row' justifyContent='space-evenly' alignItems='center'>
				<div
					className={classes.setNumber}
					style={{
						color: theme.text.value,
						transition: theme.transition.value
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
					onChange={(e) => handleEditSetDetail(e, exerciseIdx, setIdx)}
					sx={{
						color: theme.text.value,
						transition: theme.transition.value
					}}
				/>
				<Input
					className={classes.setDetailInput}
					name='lbs'
					type='number'
					value={set?.lbs}
					inputProps={{ min: 0 }}
					onChange={(e) => handleEditSetDetail(e, exerciseIdx, setIdx)}
					sx={{
						color: theme.text.value,
						transition: theme.transition.value
					}}
				/>
				<Input
					className={classes.setDetailInput}
					name='rpe'
					type='number'
					value={set?.rpe}
					inputProps={{ min: 0, max: 10 }}
					onChange={(e) => handleEditSetDetail(e, exerciseIdx, setIdx)}
					sx={{
						color: theme.text.value,
						transition: theme.transition.value
					}}
				/>
				<div
					className={classes.closeIconContainer}
					onClick={() => handleDeleteSet(exerciseIdx, setIdx)}
				>
					<CloseIcon className={classes.closeIcon} />
				</div>
			</Stack>
		</>
	);
}

export default ExerciseSetRow;
