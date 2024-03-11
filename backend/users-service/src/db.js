const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	Email: String,
	Name: String,
	Password: String,
	UserId: Number 
});
const User = mongoose.model("User", userSchema)

module.exports = { User }