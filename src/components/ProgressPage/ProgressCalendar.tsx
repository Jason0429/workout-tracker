import { LocalizationProvider, StaticDatePicker } from "@mui/lab";
import { Paper, TextField } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import "react-calendar/dist/Calendar.css";
import { useThemeState } from "../../states/ThemeState";
import { useProgressPageState } from "./ProgressPageState";
import { useState } from "react";

function ProgressCalendar() {
	const theme = useThemeState();
	const { ...state } = useProgressPageState();
	const [selectedDate, setSelectedDate] = useState(new Date());

	/**
	 * Handles calendar date's on change event.
	 * @param newDate new Date object.
	 */
	const handleOnChangeSelectedDate = (newDate: Date | null) => {
		if (!newDate) return;
		setSelectedDate(newDate);
		state.handleOnDateChange(newDate);
	};

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
					value={selectedDate}
					onChange={(newDate: Date | null) => handleOnChangeSelectedDate(newDate)}
					renderInput={(params) => <TextField {...params} />}
				/>
			</LocalizationProvider>
		</Paper>
	);
}

export default ProgressCalendar;
