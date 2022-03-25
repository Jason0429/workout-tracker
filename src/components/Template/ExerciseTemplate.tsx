import { useState } from "react";
import {
	Stack,
	Paper,
	IconButton,
	Accordion,
	AccordionSummary,
	AccordionDetails
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExerciseSetRow from "./ExerciseSetRow";
import { ExerciseType } from "../../models";
import { useStyles } from "../../styles/classes";
import Spacer from "../Global/Spacer";
import { useHookstate } from "@hookstate/core";
import { globalTheme } from "../../states/theme.state";
import { handleAddSet, handleDeleteExercise } from "../../states/TemplatePage.state";

type Props = {
	exercise: ExerciseType;
	exerciseIdx: number;
};

function ExerciseTemplate({ exercise, exerciseIdx }: Props) {
	const classes = useStyles();
	const theme = useHookstate(globalTheme);
	const [expanded, setExpanded] = useState(true);

	return (
		<Paper
			variant='outlined'
			sx={{
				background: "#cecece50",
				width: "350px"
			}}
		>
			<Accordion
				disableGutters
				expanded={expanded}
				onChange={() => setExpanded((expanded) => !expanded)}
				sx={{
					background: "transparent",
					boxShadow: "none"
				}}
			>
				<AccordionSummary>
					{/* Name and Close Button */}
					<Stack
						direction='row'
						justifyContent='space-between'
						alignItems='center'
						width='100%'
					>
						<IconButton size='small'>
							<KeyboardArrowDownIcon
								sx={{
									color: theme.text.value,
									transform: `rotate(${expanded ? "0deg" : "180deg"})`,
									transition: theme.transition.value
								}}
							/>
						</IconButton>
						<div
							className={classes.exerciseTemplateHeader}
							style={{
								color: theme.text.value,
								transition: theme.transition.value
							}}
						>
							{exercise.name}
						</div>
						<div
							className={classes.redXBtn}
							onClick={() => handleDeleteExercise(exerciseIdx)}
						>
							<CloseIcon
								style={{
									width: "20px",
									height: "20px"
								}}
							/>
						</div>
					</Stack>
				</AccordionSummary>

				<AccordionDetails>
					{/* Set, Reps, lbs., RPE headers */}
					<Stack direction='column' spacing={2}>
						<Stack direction='row' justifyContent='space-evenly' alignItems='center'>
							<div
								className={classes.exerciseTemplateSubHeader}
								style={{
									color: theme.detailText.value,
									transition: theme.transition.value
								}}
							>
								Set
							</div>
							<div
								className={classes.exerciseTemplateSubHeader}
								style={{
									color: theme.detailText.value,
									transition: theme.transition.value
								}}
							>
								Reps
							</div>
							<div
								className={classes.exerciseTemplateSubHeader}
								style={{
									color: theme.detailText.value,
									transition: theme.transition.value
								}}
							>
								lbs.
							</div>
							<div
								className={classes.exerciseTemplateSubHeader}
								style={{
									color: theme.detailText.value,
									transition: theme.transition.value
								}}
							>
								RPE
							</div>
							<Spacer width='40px' />
						</Stack>

						{/* Set Rows */}
						{exercise.sets.map((set, idx) => (
							<ExerciseSetRow
								key={idx}
								set={set}
								exerciseIdx={exerciseIdx}
								setIdx={idx}
							/>
						))}

						{/* Add Set Row Button */}
						<div className={classes.grayBtn} onClick={() => handleAddSet(exerciseIdx)}>
							+ Add Set
						</div>
					</Stack>
				</AccordionDetails>
			</Accordion>
		</Paper>
	);
}

export default ExerciseTemplate;
