const bodyParser = require("body-parser");
const express = require("express");
const dotenv = require("dotenv");

const rotateKey = require("./rotateKey.js");
const api = require("./api.js");

const dbConnect = require("../../common/dbConnect.js");
const ports = require("../../common/ports.js");
const probeServer = require("../../common/probing.js");

// Start the server
const app = express();
probeServer(app);

// Start background job to rotate the secret key
dotenv.config();
rotateKey.startCronJob();

// Add JSON parser middleware
app.use(bodyParser.json());

// Log incoming requests
app.use((req, res, next) => {
	console.log(`Received request: ${req.method} ${req.originalUrl}`);
	next();
})

app.get("/", (req, res) => { res.json("Welcome to the 'users' microservice.") })

app.get("/api/user/ping", (req, res) => res.send("pong"));

app.post("/api/user/CreateUser", api.createUser); 
app.post("/api/user/userList", api.userList);
app.post("/api/user/ValidateEmailLogin", api.validateEmail);
app.post("/api/user/ValidateName", api.ValidateName); 
app.post("/api/user/ValidateLogin", api.ValidateLogin); 
app.get("/api/user/validateUserId", api.validateUserId); 

app.post("/api/user/updateName", api.updateName); 
app.post("/api/user/updateEmail", api.updateEmail);
app.post("/api/user/updatePassword", api.updatePassword);


app.post("/api/user/getPassword", api.getPassword);



dbConnect();

app.listen(ports.user, () => console.log(`Server listening on http://localhost:${ports.user}`));



















/*


const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const express = require("express");
const dbConnect = require("../../dbConnect.js");
const dotenv = require("dotenv");
const rotateKey = require("./rotateKey.js");
const { User } = require("./db.js");
const ports = require("../../ports.js");
const probeServer = require("../../probing.js");

// Start the server
const app = express();
probeServer(app);

// Start background job to rotate the secret key
dotenv.config();
rotateKey.startCronJob();

// Add JSON parser middleware
app.use(bodyParser.json());

// Log incoming requests
app.use((req, res, next) => {
	console.log(`Received request: ${req.method} ${req.originalUrl}`);
	next();
})

app.get("/", (req, res) => { res.json("Welcome to the 'users' microservice.") })

app.post("/api/user/CreateUser", async (req, res) => {
	const {Email, Name, Password} = req.body;

	try{
		let id = await User.count() + 1;
		const user = new User({Email, Name, Password, UserId: id});
		user.save();

		console.log("User saved: ", user);
		return res.status(200);
	} catch (error) {
		console.error("Failed to insert into database", error);
		return res.status(400).json({ error: "Failed to insert into database"});
	}
});

app.post("/api/user/userList", async (req, res) => {
	try {
		const list = await User.find().select("Name UserId");
		console.log("User list: ", list)
		res.json(list);
	} catch (error) {
		console.error("Failed to retrieve user list", error);
		return res.status(400).json({ error: "userlist"});
	}
});

app.post("/api/user/ValidateEmail", async (req, res) => {
	const Email = req.body.Email;

	try {
		const checkEmail = await User.findOne({Email: Email});

		if(checkEmail) return res.status(400).json({ error: "Email already exists"});
		else		   return res.status(200).send("email doesnt exist");
	} catch (error) {
		console.error("Failed to find a user by email", error);
		return res.status(400).json({ error: "Failed to find a user by email"});
	}
});

app.post("/api/user/ValidateName", async (req, res) => {
	const Name = req.body.Name; 

	try {
		let checkName  = await User.findOne({Name: Name});

		if(checkName) return res.status(400).json({ error: "Name already exists"});
		else		  return res.status(200).send("name doesnt exist");
	} catch (error) {
		console.error("Failed to find a user by name", error);
		return res.status(400).json({ error: "Failed to find a user by name"});
	}
});

app.post("/api/user/ValidateLogin", async (req, res) => {
	const Email  = req.body.Email;
	const Password = req.body.Password;

	try{
		let person  = await User.findOne({Email: Email, Password: Password});

		if (person.Email !== Email || person.Password !== Password) 
			return res.status(400).json({ error: "authentication failed"});
		
		// generate a time-limited token and return it with the response
		
		const tokenPayload = { userId: person.UserId, name: person.Name };

		let token = null;
		try {
			token = jwt.sign(tokenPayload, process.env.SECRET_KEY, { expiresIn: "1h" });
		} catch (error) {
			return res.status(400).send({error: "Failed to generate JWT token."});
		}

		console.log("User authenticated: ", person);
		return res.status(200).send({token, message: "authentication successful"});
	} catch (error) {
		console.error("Failed to authenticate", error);
		return res.status(400).json({ error: "error, failed to authenitcate"});
	}
});

app.get("/api/user/validateUserId", async (req, res) => {  
	try {
		const exists = await User.exists({ UserId: req.query.userId });
		
		console.log("User exists: ", exists);

		if (exists !== null) res.status(200).send("User exists")
	    else res.status(404).json({ message: "User with specified ID not found." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error retrieving the user." });
	}
});

app.post("/api/user/updateName", async (req, res) => {
	const { newName } = req.body;

	try {
		// extract and decode token
		const token = req.header("Authorization").replace("Bearer ", "");

		let decoded = null;
		try {
			decoded = jwt.verify(token, process.env.SECRET_KEY);
		} catch (error) {
			console.error("jwt.verify() failed: ", error);
		}
		
		const userId = decoded.userId;
		const user = await User.findOneAndUpdate({UserId: userId}, { Name: newName }, { new: true });

		console.log("Updated name of user: ", user)

		if (user) res.json({ success: true, user });
		else 	  res.status(404).json({ success: false, message: "User not found" });

	} catch (error) {
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
			decoded = jwt.verify(token, process.env.SECRET_KEY);
		} catch (error) {
			console.error("jwt.verify() failed: ", error);
		}
		
		// token is valid from this point
		const userId = decoded.userId;

		// find the user by userId and update the email
		const user = await User.findOneAndUpdate({UserId: userId}, { Email: newEmail }, { new: true });

		console.log("Updated email of user: ", user)

		if (user) res.json({ success: true, user });
		else      res.status(404).json({ success: false, message: "User not found" });
	
	} catch (error) {
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
			decoded = jwt.verify(token, process.env.SECRET_KEY);
		} catch (error) {
			console.error("jwt.verify() failed: ", error);
		}
		
		const userId = decoded.userId;
		const user = await User.findOneAndUpdate({UserId: userId}, { Password: newPassword }, { new: true });

		console.log("Updated password of user: ", user)

		if (user) res.json({ success: true, user });
		else      res.status(404).json({ success: false, message: "User not found" });
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
			decoded = jwt.verify(token, process.env.SECRET_KEY);
		} catch (error) {
			console.error("jwt.verify() failed: ", error);
		}
		
		const userId = decoded.userId;

		const user = await User.findOne({UserId: userId}).select("Password");

		console.log("Retrieved password of user: ", user)

		if (user) res.json({ success: true, user });
		else      res.status(404).json({ success: false, message: "User not found" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, error: "Internal Server Error" });
	}
});

dbConnect();

app.listen(ports.user, () => console.log(`Server listening on http://localhost:${ports.user}`));



 */