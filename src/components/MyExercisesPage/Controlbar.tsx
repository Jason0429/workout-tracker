import { Paper, Stack } from "@mui/material";
import { useThemeState } from "../../states/ThemeState";
import { useStyles } from "../../styles/classes";

interface Props {
	setOpenAddExerciseDialog: Function;
}

function Controlbar({ setOpenAddExerciseDialog }: Props) {
	const theme = useThemeState();
	const classes = useStyles();

	return (
		<Paper
			variant='outlined'
			sx={{
				zIndex: 2,
				padding: "20px",
				position: "fixed",
				bottom: 0,
				width: "100%",
				background: theme.background,
				transition: theme.transition
			}}
		>
			<Stack direction='column' alignItems='center' justifyContent='center'>
				<button className={classes.blueBtn} onClick={() => setOpenAddExerciseDialog(true)}>
					+ Add New Exercise
				</button>
			</Stack>
		</Paper>
	);
}

export default Controlbar;
