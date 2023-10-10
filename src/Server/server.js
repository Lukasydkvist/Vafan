const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const User = require("./user.js");
const MeetingProp = require("./meeting.js");
const MeetingParticipan = require("./meetingParticipan.js");

const schedule = require("../rotate_key.js");
schedule.startCronJob();



const my_path = "../../build/";

app.use(bodyParser.json());

// Serve static files from the build folder
app.use(express.static(path.join(__dirname, my_path)));

//database stuff 
app.post("/api/meeting/save", async (req, res) => {
	try{
		const {location, startTime, endTime, agenda, date} = req.body;
		let meetingId = ~~(Math.random() * 1000000);
		let check = 0;
		let meetingReturn;
		console.log("meeting/save");
		while(!check)
		{	
			meetingReturn = await MeetingProp.findOne({meetingId: meetingId});
			if(meetingReturn === null)
			{
				check = 1;
			}
		}
		const token = req.header("Authorization").replace("Bearer ", "");

		let decoded = null;
		try {
			decoded = jwt.verify(token, secretKey);
		} catch (error) {
			console.log("jwt.verify() failed: ", error);
		}
		const userId = decoded.userId;
		const userName = decoded.name;
		console.log(userName);
		const meetingProposal = new MeetingProp({meetingId: meetingId,
			location:location, 
			startTime:startTime, 
			endTime:endTime,
			createrUserId:userId,
			createrName: userName,
			agenda:agenda,
			date:date});
		await meetingProposal.save();
		return res.json({meetingId:meetingId});
	}
	catch{
		return res.status(400).json({ error: "Faill to insert to database"});
	}
});

app.post("/api/userList", async (req, res) => {
	try{
		const list = await User.find().select("Name UserId");
		res.json(list);
	}
	catch{
		return res.status(400).json({ error: "userlist"});
	}
});

app.post("/api/addParticipantsToMeetings", async (req, res) => {
	const {users, meetingId} = req.body;
	const mId = parseInt(meetingId);
	users.forEach(async userId =>	{
		let uId = parseInt(userId);
		let newMeetingParticipan = new MeetingParticipan({meetingId:mId, UserId:uId});
		await newMeetingParticipan.save();
	});
});

app.post("/api/meetingList", async (req, res) => {
	const token = req.header("Authorization").replace("Bearer ", "");
	let decoded = null;
	try {
		decoded = jwt.verify(token, secretKey);
	} catch (error) {
		console.log("jwt.verify() failed: ", error);
	}
	const userId = decoded.userId;
	const list = await MeetingParticipan.find({UserId: userId});
	const temp = await MeetingProp.find();
	console.log(list);
	console.log(temp);
	let returnMeeting = [];
	list.forEach(invite => {
		console.log(invite.meetingId);
		temp.forEach(meeting => {
			if(meeting.meetingId === invite.meetingId)
			{
				returnMeeting = returnMeeting.concat(meeting);
			}	
		});
	});
	console.log("server");
	console.log(returnMeeting);
	res.json(returnMeeting);
});

app.post("/api/YoureMeetingList", async (req, res) => {
	const token = req.header("Authorization").replace("Bearer ", "");
	let decoded = null;
	try {
		decoded = jwt.verify(token, secretKey);
	} catch (error) {
		console.log("jwt.verify() failed: ", error);
	}
	const userId = decoded.userId;
	const list = await MeetingParticipan.find({UserId: userId});
	const temp = await MeetingProp.find();
	console.log(list);
	console.log(temp);
	let returnMeeting = [];
	list.forEach(invite => {
		temp.forEach(meeting => {
			if(meeting.createrUserId === invite.UserId)
			{
				returnMeeting = returnMeeting.concat(meeting);
			}	
		});
	});
	res.json(returnMeeting);
});

app.get("/api/meeting", async(req, res) => {    
	try{
		const nextMeeting = await MeetingProp.find({}).sort("startTime").limit(1);
		if(nextMeeting)
		{
			res.json(nextMeeting);
		} else {
			res.status(404).json({ message: "No upcoming meetings found" });
		}
	} catch {
		res.status(500).json({ message: "Error retrieving next meeting" });
	}
});


// Handle requests to the root URL
app.get(["/", "/home", "/login", "/meetingScheduler", "/*"], (req, res) => {
	// Send the index.html file from the build folder as the response
	res.sendFile(path.join(__dirname, my_path, "index.html"));
});

// Start the server
app.listen(3001, () => console.log("Server is listening on port 3001."));


app.post("/api/ValidateEmail", async (req, res) => {
	const Email = req.body.Email;

	try{
		const checkEmail = await User.findOne({Email: Email});

		if(checkEmail)
			return res.status(400).json({ error: "Email already exists"});
		else
			return res.status(200).send("email doesnt exist");
	}
	catch{
		return res.status(400).json({ error: "Failed to insert into database"});
	}
});

app.post("/api/ValidateName", async (req, res) => {
	const Name = req.body.Name;

	try{
		let checkName  = await User.findOne({Name: Name});

		if(checkName)
			return res.status(400).json({ error: "Name already exists"});
		else
			return res.status(200).send("name doesnt exist");
	}
	catch{
		return res.status(400).json({ error: "Failed to insert into database"});
	}
});

app.post("/api/CreateUser", async (req, res) => {
	const {Email, Name, Password} = req.body;

	try{
		let id = await User.count() + 1;
		const user = new User({Email: Email,
			Name: Name,
			Password: Password,
			UserId: id});
		user.save();
		return res.status(200);
	}
	catch{
		return res.status(400).json({ error: "Failed to insert into database"});
	}
});

app.post("/api/ValidateLogin", async (req, res) => {
	const Email  = req.body.Email;
	const Password = req.body.Password;

	try{
		let person  = await User.findOne({Email: Email, Password: Password});

		if(person.Email === Email && person.Password === Password){
			// authenticaton was successfull, generate a time-limited token
			// and return it with the response
			const tokenPayload = {
				userId: person.UserId,//,
				//email: person.Email,
				name: person.Name
			};

			let token = null;
			try {
				token = jwt.sign(tokenPayload, secretKey, {
					expiresIn: "8h" // token expires in 8 hours
				});
			} catch (error) {
				return res.status(400).send({error: "Failed to generate JWT token."});
			}

			return res.status(200).send({token, message: "authentication successful"});
		}
		else{
			return res.status(400).json({ error: "authentication failed"});
		}

	}
	catch {
		return res.status(400).json({ error: "error, failed to authenitcate"});
	}
});
         
app.post("/api/updateName", async (req, res) => {
	const { newName } = req.body;

	try {
		// extract and decode token
		const token = req.header("Authorization").replace("Bearer ", "");

		let decoded = null;
		try {
			decoded = jwt.verify(token, secretKey);
		} catch (error) {
			console.log("jwt.verify() failed: ", error);
		}
		
		// token is valid from this point
		const userId = decoded.userId;

		// find the user by userId and update the name
		const user = await User.findOneAndUpdate({UserId: userId}, { Name: newName }, { new: true });

		if (user) {			
			res.json({ success: true, user });
		} else {
			res.status(404).json({ success: false, message: "User not found" });
		}
	} catch (error) {
		// jwt.verify() throws an error if token is invalid
		console.error(error);
		res.status(500).json({ success: false, error: "Internal Server Error" });
	}
});

app.post("/api/updateEmail", async (req, res) => {
	const { newEmail } = req.body;

	try {
		// extract and decode token
		const token = req.header("Authorization").replace("Bearer ", "");

		let decoded = null;
		try {
			decoded = jwt.verify(token, secretKey);
		} catch (error) {
			console.log("jwt.verify() failed: ", error);
		}
		
		// token is valid from this point
		const userId = decoded.userId;

		// find the user by userId and update the email
		const user = await User.findOneAndUpdate({UserId: userId}, { Email: newEmail }, { new: true });

		if (user) {			
			res.json({ success: true, user });
		} else {
			res.status(404).json({ success: false, message: "User not found" });
		}
	} catch (error) {
		// jwt.verify() throws an error if token is invalid
		console.error(error);
		res.status(500).json({ success: false, error: "Internal Server Error" });
	}
});

app.post("/api/updatePassword", async (req, res) => {
	const { newPassword } = req.body;

	try {
		// extract and decode token
		const token = req.header("Authorization").replace("Bearer ", "");

		let decoded = null;
		try {
			decoded = jwt.verify(token, secretKey);
		} catch (error) {
			console.log("jwt.verify() failed: ", error);
		}
		
		// token is valid from this point
		const userId = decoded.userId;

		// find the user by userId and update the email
		const user = await User.findOneAndUpdate({UserId: userId}, { Password: newPassword }, { new: true });

		if (user) {			
			res.json({ success: true, user });
		} else {
			res.status(404).json({ success: false, message: "User not found" });
		}
	} catch (error) {
		// jwt.verify() throws an error if token is invalid
		console.error(error);
		res.status(500).json({ success: false, error: "Internal Server Error" });
	}
});

app.post("/api/getPassword", async (req, res) => {
	try {
		// extract and decode token
		const token = req.header("Authorization").replace("Bearer ", "");

		let decoded = null;
		try {
			decoded = jwt.verify(token, secretKey);
		} catch (error) {
			console.log("jwt.verify() failed: ", error);
		}
		
		// token is valid from this point
		const userId = decoded.userId;

		// find the user by userId and update the email
		const user = await User.findOne({UserId: userId}).select("Password");

		if (user) {			
			res.json({ success: true, user });
		} else {
			res.status(404).json({ success: false, message: "User not found" });
		}
	} catch (error) {
		// jwt.verify() throws an error if token is invalid
		console.error(error);
		res.status(500).json({ success: false, error: "Internal Server Error" });
	}
});

//url to DB
const url = "mongodb+srv://Filmdados:TimeFlow@timeflow.bba95oe.mongodb.net/?retryWrites=true&w=majority"; 

//connect to db
async function connect(){
	try{
		await mongoose.connect(url);
		console.log("Connected to database.");
	}
	catch(error) {
		console.error(error);
	}
}
connect();








