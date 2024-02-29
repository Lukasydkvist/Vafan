const mongoose = require("mongoose");

// Meeting proposal
const meetingProposalSchema = new mongoose.Schema({
	meetingId: Number,      
	location: String,              
	startTime: String,
	endTime: String,
	createrUserId: Number,
	createrName: String,
	agenda: String,
	date: Date,
	day: Number,
	month: Number
});
const MeetingProp = mongoose.model("MeetingProp", meetingProposalSchema);

// Meeting participant
const meetingParticipant = new mongoose.Schema({
	meetingId: Number,  
	UserId: Number
});
const MeetingParticipant = mongoose.model("MeetingParticipant", meetingParticipant);

module.exports = {
	MeetingProp,
	MeetingParticipant
}