import { LocalizationProvider, StaticDatePicker } from "@mui/lab";
import { Paper, TextField } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import "react-calendar/dist/Calendar.css";
import { useThemeState } from "../../states/ThemeState";
import { useProgressPageState } from "./ProgressPageState";

function ProgressCalendar() {
	const theme = useThemeState();
	const progressPageState = useProgressPageState();

	return (
		<Paper
			variant='outlined'
			sx={{
				height: "fit-content",
				width: "350px",
				background: theme.paperBackground
			}}
		>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<StaticDatePicker
					orientation='portrait'
					openTo='day'
					// value={new Date()}
					value={progressPageState.selectedDate}
					onChange={(newDate: Date | null) =>
						progressPageState.handleOnDateChange(newDate)
					}
					renderInput={(params) => <TextField {...params} />}
				/>
			</LocalizationProvider>
		</Paper>
	);
}

export default ProgressCalendar;
