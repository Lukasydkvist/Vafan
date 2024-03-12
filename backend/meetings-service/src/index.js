
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { MeetingParticipant, MeetingProp } = require("./db.js");
const dotenv = require("dotenv");
const ports = require("../../common/ports.js");
const dbConnect = require("../../common/dbConnect.js");
const probeServer = require("../../common/probing.js");

process.env.secretKey = "f7a1e6f5bcc572df86961d8558acc1071a05556be93d1662b4e5bbdf0daa90aa9c04ea16dab4c52a924147a663427d0bf609fdf1214cabf369c8f6405481c6bb88e3346a90c4b093cf5c378de8d443d3eb0c581f71ab8d78415787474eaf503de99000e094bd42c138b3ff5e4f51dd9071f39e8815d308412fe83d3f0d1ac94f88329afa1c6c87903a515d945d4ba81ed4559eacb022cb3dc6de12f139a4b27831b4c04a9287a6452e4224a4865e55f9cb81f74eeff160db2fccfea16cb45ae304a299297401ab072293a6064b296a6099fac7fb452f7929ce609ca807bfa0926f5b834f3278465e22f0ea1a709501649bb835a4b26df0c94fb5493eb2b833a5dafe35af83cd043155a2be91271d8a819b8eb5311522d0aec0ccff026c0b297cb77376602dd2f6281d8728f74ff63ae37a92a3d663869dd0c2cf2e7c07a476f3f574d245762fa9ecaf6d3a80b5a0c0118c7f3b6906e0798d7841c46f0a11ef6b66b2021efcb86e814a71249df76b790cfbbc91288a337589a6125a110de6c52941a4880ccc3a7d55e01efa67e2e43f0ac4521cd59e2f9a137f59f4b2d19e9c2603f3cca4f5ec99e22df3e5422779773aa215fe7320ef32f99f182dd7c4bc22b37e47910dab359f88f6f5f54ecb164e575bb5592ba5baa7f2fabb9fefa33fb3a2eb732e0c45b47c21f693b6031deb51533fe18de63085e7e9c4aa11d786bd5731"

dotenv.config();
dbConnect();

// Start the server
const app = express();
probeServer(app);
console.log("Server started");
// Add JSON parser middleware
app.use(bodyParser.json());

// Log incoming requests
app.use((req, res, next) => {
	console.log(`Received request: ${req.method} ${req.originalUrl}`);
	next();
})

app.get("/", (req, res) => { res.json("Welcome to the 'meetings' microservice.") })

app.get("/api/meet/ping", (req, res) => res.send("pong"));

app.post("/api/meet/meeting/save", async (req, res) => {
	console.log("this is meeting/save");
	try{
		const {location, startTime, endTime, agenda, date} = req.body;
		
		let meetingId = ~~(Math.random() * 1000000);

		const dateNew = new Date(date);
		const newday = dateNew.getDate();
		const newmonth = dateNew.getMonth()+1;

		const token = req.header("Authorization").replace("Bearer ", "");

		let decoded = null;
		try {
			decoded = jwt.verify(token, process.env.secretKey);
		} catch (error) {
			console.error("jwt.verify() failed: ", error);
		}
	
		const meetingProposal = new MeetingProp({
			meetingId,
			location, 
			startTime, 
			endTime,
			createrUserId: decoded.userId,
			createrName: decoded.name,
			agenda,
			date,
			day:newday,
			month:newmonth
		});
		await meetingProposal.save();
		
		console.log("Meeting saved: ", meetingProposal)

		return res.json({meetingId:meetingId});
	} catch {
		return res.status(400).json({ error: "Faill to insert to database"});
	}
});

app.post("/api/meet/addParticipantsToMeetings", async (req, res) => {
	const {users, meetingId} = req.body;
	let mId = parseInt(meetingId);
	try{
		users.forEach(async userId =>	{
			let uId = parseInt(userId);
			let newMeetingParticipan = new MeetingParticipant({meetingId:mId, UserId:uId});
			await newMeetingParticipan.save();
		});

		console.log("Added participants to meeting:", meetingId, "Participants:", users);
		return res.status(200).json({ message: "Participants added successfully" });
	} catch(error) {
		console.error(error);
		return res.status(400).json({ error: "Failed to insert into database"});
	}	
});

app.post("/api/meet/DeleteMeeting", async (req, res) => {
	const { meetingId } = req.body;

	try {
		const meetingDeleteResult = await MeetingProp.deleteOne({ meetingId: meetingId });

		if (meetingDeleteResult.deletedCount === 0) {
			console.error("Failed to find meeting:", meetingId)
			return res.status(404).json({ error: "Meeting not found" });
		}

		let responseDel;
		do {
			responseDel = await MeetingParticipant.deleteOne({ meetingId: meetingId });
		} while (responseDel.deletedCount > 0);

		console.log("Deleted meeting and its participants:", meetingId);
		return res.status(200).json({ message: "Meeting and participants deleted successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

app.post("/api/meet/meetingList", async (req, res) => {
	console.log("this is meetingList");
	try {
		console.log("this is meetingList//");
		const token = req.header("Authorization").replace("Bearer ", "");
		console.log("token is : ", token);
		let decoded = null;
		console.log("decoded is : ", decoded);
		try {
			decoded = jwt.verify(token, process.env.secretKey);
			console.log("decoded is : ", decoded);
		} catch (error) {
			console.error("jwt.verify() failed: ", error);
			console.log("it is catched ");
		}

		const userId = decoded.userId;
		console.log(userId)
		console.log("userId is : ", userId);
		const list = await MeetingParticipant.find({UserId: userId});
		console.log("list is : ", list);
		const temp = await MeetingProp.find();
		console.log("temp is : ", temp);
		let returnMeeting = [];
		console.log("returnMeeting is : ", returnMeeting);
		
		list.forEach(invite => {
			temp.forEach(meeting => {
				if(meeting.meetingId === invite.meetingId)
				{
					returnMeeting = returnMeeting.concat(meeting);
					console.log("returnMeeting is : ", returnMeeting);
				}	
			});
		});

		createdMeetings = await MeetingProp.find({createrUserId: userId});
		returnMeeting = [...createdMeetings, ...returnMeeting]
		console.log("Meeting list:", returnMeeting);
		res.json(returnMeeting);
	} catch (error) {
		console.error(error);
		console.log("error is catched");
	}
});

app.post("/api/meet/YoureMeetingList", async (req, res) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		
		let decoded = null;
		try {
			decoded = jwt.verify(token, process.env.secretKey);
		} catch (error) {
			console.error("jwt.verify() failed: ", error);
		}
		
		const userId = decoded.userId;
		
		const meetings = await MeetingProp.find();
		let filteredMeetings = meetings.filter(meeting => meeting.createrUserId === userId);
		
		console.log("Your meeting list:", filteredMeetings);
		res.json(filteredMeetings);
	} catch (error) {
		console.error(error);
	}
});

app.post("/api/meet/meeting", async(req, res) => { 
	console.log("this is meeting");   
	try{
		console.log("this is meeting//");
		const token = req.header("Authorization").replace("Bearer ", "");
		console.log("token: ", token);
		
		let decoded = null;
		try {
			decoded = jwt.verify(token, process.env.secretKey);
		} catch (error) {
			console.log("jwt.verify() failed: ", error);
		}
		
		const userId = decoded.userId;
		const list = await MeetingParticipant.find({UserId: userId});
		const meetings =  await MeetingProp.find({});
		let nextMeeting = new MeetingProp({day:99, month:99});
		const cDate = new Date();
		
		list.forEach(invite => {
			meetings.forEach(meeting => {
				if(invite.meetingId === meeting.meetingId && meeting.month <= nextMeeting.month && meeting.day <= nextMeeting.day) {
					if(meeting.day >= cDate.getDate() && meeting.day >= cDate.getMonth())
						nextMeeting = meeting;
				}
			});
		});

		if(nextMeeting) res.json(nextMeeting);
		else 			res.status(404).json({ message: "No upcoming meetings found" });

	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error retrieving next meeting" });
	}
});

app.listen(ports.meeting, () => console.log(`Server listening on http://localhost:${ports.meeting}`));