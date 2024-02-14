const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Start the server
const port =  3003;

const jwt = require("jsonwebtoken");

require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

//const User = require("./meeting.js");
const MeetingProp = require("./meeting.js");
const MeetingParticipan = require("./meetingParticipan.js");

const schedule = require("../../rotate_key.js");
schedule.startCronJob();

//const my_path = "../../build/";
//const my_path = "../../../build/";

app.use(bodyParser.json());

app.use("/api/meet/", (req, res) => {
    res.json("This is meeting")
})

//database stuff 
app.post("/api/meet/meeting/save", async (req, res) => {
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


app.post("api/meet/addParticipantsToMeetings", async (req, res) => {
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

app.post("/api/meet/DeleteMeeting", async (req, res) => {
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


app.listen(port, () => console.log(`server listening on http://localhost:${port}`));






