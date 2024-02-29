import { List, ListItemButton, Grid } from "@mui/material";
import React,{Component} from "react";
import "../color.css";
import "./CoworkerList.css";

export class CoworkerList extends Component {
	render(){
		return(
			<Grid className="grid">
				<List className="coWorkerList">
					{menuItems.map(item => (
						<ListItemButton className="coWorkerInfo" key={item.name}>
							<Grid item xs={12}>
								<Grid xs={6}>{item.name}</Grid>
								<Grid xs={6}>{item.work}</Grid>
							</Grid>
						</ListItemButton>
					))} 
				</List>
			</Grid>
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

export default CoworkerList;