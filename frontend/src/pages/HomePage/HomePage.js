import React,{Component} from "react";
import {Grid} from "@mui/material";

import {WeekDisplay} from "../WeekDisplay/WeekDisplay";
import {NextMeeting} from "../NextMeeting/NextMeeting";
import Profile from "../Profile/profile";
import ButtonNavBar from "../HeadPanel/HeadPanel";

export class HomePage extends Component {
	render(){
		return( 
			<Grid container className="container" backgroundColor="#FAFAFA" >
				
				<Grid item xs={12}>
					<ButtonNavBar/>
				</Grid>
				<Grid item xs={7}>
					<WeekDisplay/>
				</Grid>
				<Grid item xs={5}>
					<Grid container item xs={12}>
						<NextMeeting/>
					</Grid>
					<Grid item xs={12}>
						<Profile/>
					</Grid>
				</Grid>
			</Grid>
            
		);
	}
}
export default HomePage;