import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export default function ButtonNavBar() {

	let Day = dayjs().format("DD MMMM YYYY");

	const navigate = useNavigate();

	const handleButtonNewMeeting = () => {
		navigate("/meetingScheduler");
	};

	const handleButtonLogout = () => {
		localStorage.removeItem("token");
		navigate("/");
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" sx={{backgroundColor: "#344966"}}>
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Today, {Day}
					</Typography>
					<Button color="inherit" onClick={handleButtonNewMeeting} >Book a meeting</Button>
					<Button color="inherit" onClick={handleButtonLogout} >Logout</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
}