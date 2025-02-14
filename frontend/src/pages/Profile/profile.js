import { React, Component, useState } from "react";
import { Grid, TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

import useValidateEmail from "../LoginPage/useValidateEmail";
import useValidateName from "../LoginPage/useValidateName";

import "./profile.css";
import resolveUrl from "../../utils/resolveUrl";

// token is generated by server when the user logs i

// Retrieve the token from localStorage
const token = localStorage.getItem("token");

const UserForm = () => {
	const [newName, setName] = useState("");
	const handleNameChange = (event) => {
		setName(event.target.value);
	};

	const [newEmail, setEmail] = useState("");
	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	const [currPassword, setCurrPassword] = useState("");
	const handleSetCurrPassword = (event) => {
		setCurrPassword(event.target.value);
	};

	const [newPassword, setPassword] = useState("");
	const [passwordsMatch, setPasswordsMatch] = useState(true);
	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};
	const handleConfirmPasswordChange = (event) => {
		setPasswordsMatch(event.target.value === newPassword);
	};

	const [showCurrPassword, setShowCurrPassword] = useState(false);
	const handleToggleCurrPasswordVisibility = () => {
		setShowCurrPassword(!showCurrPassword);
	};
	const [showNewPassword, setShowNewPassword] = useState(false);
	const handleToggleNewPasswordVisibility = () => {
		setShowNewPassword(!showNewPassword);
	};
	
	const HandleSaveButton = async () => {
		let userPassword = null;
		try {
			userPassword = await axios.post(resolveUrl("/api/user/getPassword"), {}, {
				headers: {
					Authorization: `Bearer ${token}`
				}}
			);
		} catch (error) {
			console.error("Failed to retreive current password: ", error);
		}

		// check to see if username already exists
		const {ValidateName}  = useValidateName();
		const NameExists  = await ValidateName(newName);

		// check to see if email already exists
		const {ValidateEmail} = useValidateEmail();
		const EmailExists = await ValidateEmail(newEmail);
		
		const { Password: oldPassword } = userPassword.data.user;
		// must type in current password in order to change anything
		if (oldPassword === currPassword)
		{
			try {
				if (newName.length > 0) {
					if (!NameExists) {
						const responseName = await axios.post(resolveUrl("/api/user/updateName"), { newName } , {
							headers: {
								Authorization: `Bearer ${token}`
							}}
						);
	
						const { success } = responseName.data;
						if (success) {
							alert("Name updated!");
						} else {
							alert("Failed updating name :(");
						}
					} else {
						alert("That username already exists :(");
					}
				}
				
	
				if (newEmail.length > 0) {
					if (!EmailExists) {
						const responseEmail = await axios.post(resolveUrl("/api/user/updateEmail"), { newEmail } , {
							headers: {
								Authorization: `Bearer ${token}`
							}}
						);
						
						const { success } = responseEmail.data;
						if (success) {
							alert("Email updated!");
						} else {
							alert("Failed updating email :(");
						}
					} else {
						alert("Can't update email :(");
					}

				}
				
				// must type in new password twice to change it
				if (passwordsMatch && newPassword.length > 0)
				{
					const responsePassword = await axios.post(resolveUrl("/api/user/updatePassword"), { newPassword } , {
						headers: {
							Authorization: `Bearer ${token}`
						}}
					);
					
					const { success } = responsePassword.data;
					if (success) {
						alert("Password updated!");
					} else {
						alert("Failed updating password :(");
					}
				} else if (!passwordsMatch) {
					alert("Gotta type in the new password twice correctly you donkey.");
				}
			} catch (error) {
				// Handle error, show an error message to the user
				console.error("Error updating user:", error);
			}
		}
	};

	return (
		<>
			<Grid Container className='profileContainer'>
				<Grid item xs={12}>
					<TextField
						margin="normal"
						id="name"
						label="Username"
						type="text"
						fullWidth
						onChange={e => handleNameChange(e)}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						margin="normal"
						id="email"
						label="E-mail"
						type="email"
						fullWidth
						onChange={e => handleEmailChange(e)}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						margin="normal"
						id="cur_password"
						label="Current password"
						type={showCurrPassword ? "text" : "password"}
						fullWidth
						onChange={e => handleSetCurrPassword(e)}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={handleToggleCurrPasswordVisibility}>
										{showCurrPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						margin="normal"
						id="new_password"
						label="Enter new password"
						type = {showNewPassword ? "text" : "password"}
						fullWidth
						onChange={e => handlePasswordChange(e)}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={handleToggleNewPasswordVisibility}>
										{showNewPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField 
						margin="normal"
						id="re_new_password"
						label="Re-type password"
						type={showNewPassword ? "text" : "password"}
						fullWidth
						error = {!passwordsMatch}
						helperText = {!passwordsMatch ? "Passwords do not match!" : ""}
						onChange={e => handleConfirmPasswordChange(e)}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={handleToggleNewPasswordVisibility}>
										{showNewPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</Grid>
				<Grid item xs={12}>
					<Button className="save_button" variant="text" onClick={HandleSaveButton} sx={{backgroundColor: "#344966", color: "white", boxShadow: 1}}>
							Save changes
					</Button>
				</Grid>
			</Grid>
		</>
	);
};


export class Profile extends Component {
	render(){
		return(
			<UserForm/>
		);
	}
}

export default UserForm;