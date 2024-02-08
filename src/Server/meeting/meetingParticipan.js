const mongoose = require("mongoose");

const meetingParticipan = new mongoose.Schema({
	meetingId: Number,  
	UserId: Number
});

module.exports = mongoose.model("meetingParticipan", meetingParticipan);