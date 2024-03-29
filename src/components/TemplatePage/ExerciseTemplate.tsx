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
import { useStyles } from "../../styles/classes";
import Spacer from "../Global/Spacer";
import { ExerciseType } from "../../firebase/Exercise";
import { SetType } from "../../firebase/Set";
import { useThemeState } from "../../states/ThemeState";
import { useTemplatePageState } from "./TemplatePageState";

type Props = {
	exercise: ExerciseType;
	exerciseIdx: number;
};

function ExerciseTemplate({ exercise, exerciseIdx }: Props) {
	const theme = useThemeState();
	const templatePageState = useTemplatePageState();
	const classes = useStyles();
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
									color: theme.text,
									transform: `rotate(${expanded ? "0deg" : "180deg"})`,
									transition: theme.transition
								}}
							/>
						</IconButton>
						<div
							className={classes.exerciseTemplateHeader}
							style={{
								color: theme.text,
								transition: theme.transition
							}}
						>
							{exercise.name}
						</div>
						<div
							className={classes.redXBtn}
							onClick={() => templatePageState.handleDeleteExercise(exerciseIdx)}
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
									color: theme.detailText,
									transition: theme.transition
								}}
							>
								Set
							</div>
							<div
								className={classes.exerciseTemplateSubHeader}
								style={{
									color: theme.detailText,
									transition: theme.transition
								}}
							>
								Reps
							</div>
							<div
								className={classes.exerciseTemplateSubHeader}
								style={{
									color: theme.detailText,
									transition: theme.transition
								}}
							>
								lbs.
							</div>
							<div
								className={classes.exerciseTemplateSubHeader}
								style={{
									color: theme.detailText,
									transition: theme.transition
								}}
							>
								RPE
							</div>
							<Spacer width='40px' />
						</Stack>

						{/* Set Rows */}
						{exercise.sets.map((set: SetType, idx: number) => (
							<ExerciseSetRow
								key={idx}
								set={set}
								exerciseIdx={exerciseIdx}
								setIdx={idx}
							/>
						))}

						{/* Add Set Row Button */}
						<div
							className={classes.grayBtn}
							onClick={() => templatePageState.handleAddSet(exerciseIdx)}
						>
							+ Add Set
						</div>
					</Stack>
				</AccordionDetails>
			</Accordion>
		</Paper>
	);
}

export default ExerciseTemplate;
