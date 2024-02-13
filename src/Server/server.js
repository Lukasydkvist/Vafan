const express = require("express");
const app = express();


const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const jwt = require("jsonwebtoken");

require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const User = require("./userService/user.js");
const MeetingProp = require("./meeting/meeting.js");
const MeetingParticipan = require("./meeting/meetingParticipan.js");

const schedule = require("../rotate_key.js");
schedule.startCronJob();

const my_path = "../../build/";

app.use(bodyParser.json());

app.get("/api/main/", (req, res) => {
    res.json("This is main")
})

//database stuff 
app.post("/api/main/meeting/save", async (req, res) => {
	try{
		const {location, startTime, endTime, agenda, date} = req.body;
		let meetingId = ~~(Math.random() * 1000000);
		let check = 0;
		let meetingReturn;

		const dateNew = new Date(date);
		const newday = dateNew.getDate();
		const newmonth = dateNew.getMonth()+1;

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
			console.error("jwt.verify() failed: ", error);
		}
		const userId = decoded.userId;
		const userName = decoded.name;
	
		const meetingProposal = new MeetingProp({meetingId: meetingId,
			location:location, 
			startTime:startTime, 
			endTime:endTime,
			createrUserId:userId,
			createrName: userName,
			agenda:agenda,
			date:date,
			day:newday,
			month:newmonth});
		await meetingProposal.save();
		return res.json({meetingId:meetingId});
	}
	catch{
		return res.status(400).json({ error: "Faill to insert to database"});
	}
});

app.post("/api/main/userList", async (req, res) => {
	try{
		const list = await User.find().select("Name UserId");
		res.json(list);
	}
	catch{
		return res.status(400).json({ error: "userlist"});
	}
});

app.post("/api/main/addParticipantsToMeetings", async (req, res) => {
	const {users, meetingId} = req.body;
	let mId = parseInt(meetingId);
	try{
		users.forEach(async userId =>	{
			let uId = parseInt(userId);
			let newMeetingParticipan = new MeetingParticipan({meetingId:mId, UserId:uId});
			await newMeetingParticipan.save();
		});
	}
	catch(error){
		console.error(error);
	}	
});

app.post("/api/main/DeleteMeeting", async (req, res) => {
	const { meetingId } = req.body;

	try {
		const meetingDeleteResult = await MeetingProp.deleteOne({ meetingId: meetingId });

		if (meetingDeleteResult.deletedCount === 0) {
			return res.status(404).json({ error: "Meeting not found" });
		}

		let responseDel;
		do {
			responseDel = await MeetingParticipan.deleteOne({ meetingId: meetingId });
		} while (responseDel.deletedCount > 0);

		return res.status(200).json({ message: "Meeting and participants deleted successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});
  


app.post("/api/meetingList", async (req, res) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		let decoded = null;
		try {
			decoded = jwt.verify(token, secretKey);
		} catch (error) {
			console.error("jwt.verify() failed: ", error);
		}
		const userId = decoded.userId;
		const list = await MeetingParticipan.find({UserId: userId});
		const temp = await MeetingProp.find();
		let returnMeeting = [];
		list.forEach(invite => {
			temp.forEach(meeting => {
				if(meeting.meetingId === invite.meetingId)
				{
					returnMeeting = returnMeeting.concat(meeting);
				}	
			});
		});
		res.json(returnMeeting);
	} catch (error) {
		console.error(error);
	}
});

app.post("/api/YoureMeetingList", async (req, res) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		let decoded = null;
		try {
			decoded = jwt.verify(token, secretKey);
		} catch (error) {
			console.error("jwt.verify() failed: ", error);
		}
		const userId = decoded.userId;
		const temp = await MeetingProp.find();
		let returnMeeting = [];
		temp.forEach(meeting => {
			if(meeting.createrUserId === userId)
			{
				returnMeeting = returnMeeting.concat(meeting);
			}	
		});
		res.json(returnMeeting);
	} catch (error) {
		console.error(error);
	}
});

app.post("/api/meeting", async(req, res) => {    
	try{
		const token = req.header("Authorization").replace("Bearer ", "");
		let decoded = null;
		try {
			decoded = jwt.verify(token, secretKey);
		} catch (error) {
			console.log("jwt.verify() failed: ", error);
		}
		const userId = decoded.userId;
		const list = await MeetingParticipan.find({UserId: userId});
		const meetings =  await MeetingProp.find({});
		let nextMeeting = new MeetingProp({day:99,
			month:99});
		const cDate = new Date();
		list.forEach(invite => {
			meetings.forEach(meeting => {
				if(invite.meetingId === meeting.meetingId)
				{
					if(meeting.month <= nextMeeting.month)
					{
						if(meeting.day <= nextMeeting.day)
						{
							if(meeting.day >= cDate.getDate() && meeting.day >= cDate.getMonth())
							{
								nextMeeting = meeting;
							}
						}
					}
				}
			});
		});
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


// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`server listening on http://localhost:${port}`));


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
					expiresIn: "1h"
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
			console.error("jwt.verify() failed: ", error);
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
			console.error("jwt.verify() failed: ", error);
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
			console.error("jwt.verify() failed: ", error);
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
			console.error("jwt.verify() failed: ", error);
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

app.get("/api/validateUserId", async(req, res) => {  
	try{
		// get id from query
		const { id } = req.body;

		const exists = await User.findOne({UserId: id});
		if(exists) {
			res.status(200);
		} else {
			res.status(404).json({ message: "User with specified ID not found." });
		}
	} catch {
		res.status(500).json({ message: "Error retrieving the user." });
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








