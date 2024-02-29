
import { Grid, Stack, Button, Box, AppBar, Toolbar, Typography} from "@mui/material";
import React,{Component} from "react";
import {TimeSelect} from "./TimeSelect/TimeSelect";
import "./TimeStack.css";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function NavBar() {

	let Day = dayjs().format("DD MMMM YYYY");

	const navigate = useNavigate();

	const handleButtonNewMeeting = () => {
		navigate("/home");
	};

	const handleButtonLogout = () => {
		localStorage.setItem("token", ""); // wipe token upon logout
		navigate("/");
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" sx={{backgroundColor: "#344966"}}>
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Today, {Day}
					</Typography>
					<Button color="inherit" onClick={handleButtonNewMeeting} >Back to homepage</Button>
					<Button color="inherit" onClick={handleButtonLogout} >Logout</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
}

export class TimeStack extends Component {
	render(){
		return(
			<div className="BackGround">
				<NavBar/>
				<Stack>
					<Grid className="block" container item xs={8}> 
						<TimeSelect className="std"/> 
					</Grid>      
				</Stack>
			</div>
		);
	}
}


export default TimeStack;