import { useHookstate } from "@hookstate/core";
import { Paper, Stack } from "@mui/material";
import { globalTheme } from "../../states/themeState";
import { useStyles } from "../../styles/classes";

interface Props {
	setOpenAddExerciseDialog: Function;
}

function Controlbar({ setOpenAddExerciseDialog }: Props) {
	const theme = useHookstate(globalTheme);
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
				background: theme.value.background,
				transition: theme.value.transition
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
