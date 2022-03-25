import { LocalizationProvider, StaticDatePicker } from "@mui/lab";
import { Paper, TextField } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { useHookstate } from "@hookstate/core";
import { globalTheme } from "../../states/theme.state";
import { globalProgressPage, handleOnDateChange } from "../../states/ProgressPage.state";
import { globalUser } from "../../states/user.state";
import { UserType } from "../../models";
import "react-calendar/dist/Calendar.css";

function ProgressCalendar() {
	const user = useHookstate(globalUser);
	const theme = useHookstate(globalTheme);
	const progressPageState = useHookstate(globalProgressPage);

	return (
		<Paper
			variant='outlined'
			sx={{
				height: "fit-content",
				width: "350px",
				background: theme.paperBackground.value
			}}
		>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<StaticDatePicker
					orientation='portrait'
					openTo='day'
					value={progressPageState.selectedDate.value}
					onChange={(newDate: Date | null) =>
						handleOnDateChange(user.value as UserType, newDate)
					}
					renderInput={(params) => <TextField {...params} />}
				/>
			</LocalizationProvider>
		</Paper>
	);
}

export default ProgressCalendar;
