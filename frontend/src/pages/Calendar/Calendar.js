
import React,{Component} from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export class Calandar extends Component {
	render(){
		return(
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DateCalendar className="calendar"/>
			</LocalizationProvider>
		);
	}
}

export default Calandar;