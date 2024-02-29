import React, { useState, useEffect } from 'react';
import { verifyToken } from "./utils/jwtVerify.js";
import axios from 'axios';

// Router
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from 'react-router-dom';

// Date and localization
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// Pages
import HomePage from './pages/HomePage/HomePage.js';
import MeetingScheduler from './pages/MeetingScheduler/MeetingScheduler.js';
import SignIn from './pages/LoginPage/Login.js';
import resolveUrl from './utils/resolveUrl.js';


// Main entry point to application.
function App() {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<BrowserRouter>
				<Routes>
					<Route index element={<AuthElement element={<HomePage />} />} />
					<Route path="/scheduler" element={<AuthElement element={<MeetingScheduler />} />} />
					<Route path='*' element={<div>404 Page not found</div>} />
				</Routes>
			</BrowserRouter>
		</LocalizationProvider>
	);
}

// Check if authenticated, else redirect to sign in
const AuthElement = ({ element }) => {
	const [tokenValid, setTokenValid] = useState(null);

	// Fetch and validate token on initial render
	useEffect(() => {
		const fetchToken = async () => {
			const userToken = localStorage.getItem("token");            
			const decodedToken = verifyToken(userToken, process.env.SECRET_KEY);

			if (decodedToken === null) {
				console.error("Invalid token");
				setTokenValid(false);
				return;
			}
				
			const response = await axios.get(resolveUrl(`/api/user/validateUserId?userId=${decodedToken.userId}`));
			setTokenValid(response.status < 400);  // Valid if under 400
		};
	
		fetchToken();
    }, []);

	console.log("Token valid: ", tokenValid);

	if (tokenValid === null) return <div></div>;

	return tokenValid ? element : <SignIn />;
} 


export default App;