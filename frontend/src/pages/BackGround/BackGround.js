import { Container } from "@mui/material";
import React,{Component} from "react";
import "./background.css";

export class BackGround extends Component {

	render(){
		return(
			<div>
				<Container className="container">
					<img src={require("./001.png")} alt="logo" className="centered-image"/>
				</Container>
			</div>
		);
	}
}
export default BackGround;
