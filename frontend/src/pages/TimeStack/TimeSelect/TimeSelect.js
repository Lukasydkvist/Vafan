import { TextField, Stack, Button, List, ListItemButton, Grid, Checkbox, Paper} from "@mui/material";
import React, {Component, useEffect, useState} from "react"; //linter magic
import "./TimeSelect.css";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import resolveUrl from "../../../utils/resolveUrl";

function AddMeeting() {
	const [inputValueFrom, setInputValueFrom] = useState("");
	const [inputValueTo, setInputValueTo] = useState("");
	const [inputValueLocation, setInputValueLocation] = useState("");
	const [inputValueAgenda, setInputValueAgenda] = useState("");
	const [inputDate, setInputDate] = React.useState(null);
	const [participants, setParticipants] = useState([]);
	let [menuItems, setMenuItems] = useState([{Name: "Eric"}]);
	const [token] = useState(localStorage.getItem("token"));

	const handelButton = async () => { 	
		const content = JSON.stringify({ location: inputValueLocation,
			startTime: inputValueFrom,
			endTime: inputValueTo,
			agenda: inputValueAgenda,
			date: inputDate
		});

		fetch(resolveUrl("/api/meet/meeting/save"), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`
			},
			body: content})
			.then((response) => response.json())
			.then((data) => {
				const {meetingId} = data;
				addParticipantsToMeetings(meetingId);
			});
	};

	const getUserList = () => {
		fetch(resolveUrl("/api/meet/userList"), { method: "POST"})
			.then((response) => response.json())
			.then((data) => {
				setMenuItems(data);
			});
	};

	const addParticipants = (id) => {
		if(participants.indexOf(id) === -1) {
			participants.push(id);
			return;
		}
		
		setParticipants(participants.filter(item => item !== id));
	};

	const addParticipantsToMeetings = async (currentMeetingId) => {
		fetch(resolveUrl("/api/meet/addParticipantsToMeetings"), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ users: participants,
				meetingId: parseInt(currentMeetingId)
			}), 
		});
	};

	useEffect(getUserList, []);

	return (
		<>
			<Stack direction={"row"}>
				<List className="coWorkerList">

					{menuItems.map((item) => (
						<Paper elevation={5} key={item}>
							<ListItemButton className="coWorkerInfo" key={item.Name}>
								<Grid container xs={12}>
									<Grid xs={8}>{item.Name}</Grid>
									<Grid xs={4}>
										<Checkbox value={item.UserId} sx={{
											color: "Black",
											"&.Mui-checked": {
												color: "darkorange",
											},
										}} onChange={(e) => addParticipants(e.target.value)}></Checkbox>
									</Grid>
								</Grid>
							</ListItemButton>
						</Paper>
					))}  
				</List>
				<Grid className="dateGrid">
					<Stack className="dateStack">
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker className="date" value={inputDate} onChange={(newValue) => setInputDate(newValue)}/>
						</LocalizationProvider>
						<TextField className="input" label="From:" value={inputValueFrom} onChange={(e) => setInputValueFrom(e.target.value)}/>
						<TextField className="input" label="To:"   value={inputValueTo} onChange={(e) => setInputValueTo(e.target.value)}/>
						<TextField className="input" label="Location" value={inputValueLocation} onChange={(e) => setInputValueLocation(e.target.value)}/>
						<TextField className="input" label="Meeting name" value={inputValueAgenda} onChange={(e) => setInputValueAgenda(e.target.value)}/>
						<Button id="AddButton" className="inputButton" variant="contained" onClick={handelButton}>
                        Add meeting
						</Button>
					</Stack>
				</Grid>
			</Stack>
		</>
	);
}

export class TimeSelect extends Component {
	render(){    
		return(
			<Grid>
				<Grid>
					<AddMeeting/>
				</Grid>
			</Grid>
		);
	}
}


export default TimeSelect;