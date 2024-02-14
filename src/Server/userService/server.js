const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//const path = require("path");
const jwt = require("jsonwebtoken");

// Start the server
const port =  3002;

require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const User = require("./user.js");

const schedule = require("../../rotate_key.js");
schedule.startCronJob();

//const my_path = "../../build/";

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json("1")
})


app.get("/api/user/", (req, res) => {
    res.json("2")
})

app.get("/api/user/test", (req, res) => {
    res.json("3")
})

app.get("/test", (req, res) => {
    res.json("3")
})

app.post("/api/user/userList", async (req, res) => {
	try{
		const list = await User.find().select("Name UserId");
		res.json(list);
	}
	catch{
		return res.status(400).json({ error: "userlist"});
	}
});

  



app.post("/api/user/ValidateEmail", async (req, res) => {
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

app.post("/api/user/ValidateName", async (req, res) => {
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

app.post("/api/user/CreateUser", async (req, res) => {
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

app.post("/api/user/ValidateLogin", async (req, res) => {
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
         
app.post("/api/user/updateName", async (req, res) => {
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

app.post("/api/user/updateEmail", async (req, res) => {
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

app.post("/api/user/updatePassword", async (req, res) => {
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

app.post("/api/user/getPassword", async (req, res) => {
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

app.get("/api/user/validateUserId", async(req, res) => {  
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

app.listen(port, () => console.log(`server listening on http://localhost:${port}`));







