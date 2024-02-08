import { Grid, Stack, ListItemButton, ListItemText, Container, Paper, Button, Dialog, DialogTitle} from "@mui/material";
import React,{Component, useState, useEffect} from "react";

import "./WeekDisplay.css";


function DispMeeting() {
	const [open, setOpen] = useState(false);
	const [menuItems, setMenuItems] = useState([]);
	const [delMenuItems, setDelMenuItems] = useState([]);
	const [token] = useState(localStorage.getItem("token"));

	const handleClickOpen = () => {
		getYoureMeetingList();
		setOpen(true);
	};
  
	const handleClose = () => {
		meetingList();
		setOpen(false);
	};

	useEffect(() => {
		fetch("/api/meet/meetingList",{ //if i put the function call here i get error i the code :(
			method: "POST",			// meetingList(); dont work...
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
			})}).then((response) => response.json())
			.then((data) => {
				setMenuItems(data);
			});
	},[token]);
	const meetingList = () => 
	{
		fetch("/api/meet/meetingList",{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
			})}).then((response) => response.json())
			.then((data) => {
				setMenuItems(data);
			});
	};
	const getYoureMeetingList = () =>
	{
		fetch("/api/meet/YoureMeetingList",{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`
			},body: JSON.stringify({
			})})
			.then((response) => response.json())
			.then((data) => {
				setDelMenuItems(data);
			});
	};
	const deleteMeeting = (id) =>
	{
		fetch("/api/meet/DeleteMeeting", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ meetingId: id })
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				return response.json();
			})
			.catch((error) => {
				console.error("Error deleting meeting:", error);
				// Handle the error here
			});

		getYoureMeetingList();
		meetingList();
	};
	
	return (
		<>
			<Container className="Panel">
				<Stack spacing={1}>
					<Button variant="outlined" onClick={handleClickOpen}>Delete a meeting</Button>
					<ListItemText className="TextPlace" alignItems={"center"} primary={ <React.Fragment> You have {menuItems.length === 0 ? "No meetings :)":"meetins to attend"} </React.Fragment> } />
					<Dialog open={open} onClose={handleClose}>
						<DialogTitle> Delet a meeting</DialogTitle>
						{Array.isArray(delMenuItems) && delMenuItems.map(Meeting => (
							// your mapping logic here
							<Paper elevation={5} className="paperContainer" key={Meeting}>
								<ListItemButton className="ListItemButton" key={Meeting.meetingId}>
									<Grid container
										spacing={2}
										direction={"row"}
										justifyContent={"space-around"}
										alignItems={"center"}>
										<Grid InfoBox xs={6}>
											<ListItemText className="TextPlace" primary={ <React.Fragment> {Meeting.day}/{Meeting.month} </React.Fragment> } />
										</Grid>
										<Grid item xs={6}>
											<ListItemText className="Text" primary={ <React.Fragment> {Meeting.startTime} to {Meeting.endTime} </React.Fragment>}/>
										</Grid>
										<Grid InfoBox xs={6}>
											<ListItemText className="TextPlace" primary={Meeting.location} />
										</Grid>
										<Grid item xs={6}>
											<Button value={Meeting.meetingId} onClick={(e) => deleteMeeting(e.target.value)}>
										DEl
											</Button>
										</Grid>
										<Grid item xs={12}>
											<ListItemText className="Text" primary={ <React.Fragment> {Meeting.agenda} </React.Fragment> }/>
										</Grid>
									</Grid>
								</ListItemButton>
							</Paper>
						))}
						<Button onClick={handleClose}>Cancel</Button>
					</Dialog>
					{menuItems.map(Meeting => (
						<Paper elevation={5} className="paperContainer" key={Meeting}>
							<ListItemButton className="ListItemButton" key={Meeting.id}>
								<Grid container
									spacing={2}
									direction={"row"}
									justifyContent={"space-around"}
									alignItems={"center"}>
									<Grid InfoBox xs={6}>
										<ListItemText className="TextPlace" primary={ <React.Fragment> {Meeting.day}/{Meeting.month} </React.Fragment> } />
									</Grid>
									<Grid item xs={6}>
										<ListItemText className="Text" primary={ <React.Fragment> {Meeting.startTime} to {Meeting.endTime} </React.Fragment>}/>
									</Grid>
									<Grid InfoBox xs={6}>
										<ListItemText className="TextPlace" primary={Meeting.location} />
									</Grid>
									{ 
										<Grid item xs={6}>
											<ListItemText className="Text" primary={ <React.Fragment> Invited by {Meeting.createrName}</React.Fragment>}/>
										</Grid>
									}
									<Grid item xs={12}>
										<ListItemText className="Text" primary={ <React.Fragment> {Meeting.agenda} </React.Fragment> }/>
									</Grid>
								</Grid>
							</ListItemButton>
						</Paper>
					))}
				</Stack>
			</Container>
		</>
	);
}

export class WeekDisplay extends Component {
	render(){
		return(
			<DispMeeting/>
		);
	}
}

export default WeekDisplay;
