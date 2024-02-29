
import { List, ListItemButton, Grid, Checkbox} from "@mui/material";
import React,{Component} from "react";
import "./MeetingCoworkerList.css";

export class MeetingCoworkerList extends Component {
	render(){
		return(
			<List className="coWorkerList">
				{menuItems.map(item => (
					<ListItemButton className="coWorkerInfo">
						<Grid container xs={12}>
							<Grid xs={8}>{item.name}</Grid>
							<Grid xs={4}>
								<Checkbox sx={{
									color: "Black",
									"&.Mui-checked": {
										color: "darkorange",
									},
								}}></Checkbox>
							</Grid>
							<Grid xs={6}>{item.work}</Grid>
						</Grid>
					</ListItemButton>
				))} 
			</List>
		);
	}
}

const menuItems = [
	{
		name: "Linus",
		work: "JTH",
	},
	{
		name: "Ivo",
		work: "HLK",
	},
	{
		name: "Lukas",
		work: "JIBS",
	},
	{
		name: "Oskar",
		work: "Hälso",
	},
	{
		name: "Lars-Olaf",
		work: "Watch Out!",
	},
	{
		name: "WowJoke",
		work: "Är det något med klockan?",
	},
	{
		name: "Elon Musk",
		work: "X",
	},
	{
		name: "Kugen",
		work: "Nä....... de tro jag faktiskt inte nä",
	},

];

export default MeetingCoworkerList;