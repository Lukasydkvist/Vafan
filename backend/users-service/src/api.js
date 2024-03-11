const { User } = require("./db.js");

//createUser function
async function createUser (req, res)  {
	console.log(req.body);
	

	const {Email, Name, Password} = req.body;

	// Log
	console.log(`Received request to create user: ${Email}, ${Name}, ${Password}`);

	try{
		let id = await User.count() + 1;
		console.log("id: ", id);
		
		const user = new User({Email, Name, Password, UserId: id});
		console.log("user: ", user);
		user.save();

		console.log("User saved: ", user);

		res.status(200).json({ Email: user.Email, Name: user.Name, UserId: user.UserId });
		return;
	} catch (error) {
        console.error("Failed to insert into database", error);
		return res.status(400).json({ error: "Failed to insert into database"});
	}
};



//userList function
async function userList( req, res){
	try {
		//const list = await User.find().select("Name UserId");
        //res.json(list);
        const list = await User.find({}, { Name: 1, UserId: 1 });
        res.status(200).json(list);
	} catch (error) {
        console.error("userlist filed", error);
		return res.status(400).json({ error: "userlist"});
	}
};



//validateEmail function
async function validateEmail (req, res) {
	const Email = req.body.Email;

	try {
		const checkEmail = await User.findOne({Email: Email});

		if(checkEmail) return res.status(400).json({ error: "Email already exists"});
		else		   return res.status(200).send("email doesnt exist");
	} catch {
		return res.status(400).json({ error: "Failed to insert into database"});
	}
};



//ValidateName function
async function ValidateName (req, res) {
	const Name = req.body.Name; 

	try {
		let checkName  = await User.findOne({Name: Name});

		if(checkName) return res.status(400).json({ error: "Name already exists"});
		else		  return res.status(200).send("name doesnt exist");
	} catch {
		return res.status(400).json({ error: "Failed to insert into database"});
	}
};

//ValidateLogin function
async function ValidateLogin(req, res) {
	const Email  = req.body.Email;
	const Password = req.body.Password;

	console.log("Validating login for: ", Email);

	try{
		let person  = await User.findOne({Email, Password});
		console.log("person: ", person);

		if (person.Email !== Email || person.Password !== Password) {
			console.log("authentication failed");
			res.status(400).json({ error: "authentication failed"});
			return;
		}
		
		// generate a time-limited token and return it with the response
		
		const tokenPayload = { userId: person.UserId, name: person.Name };
		console.log("Token payload: ", tokenPayload)

		let token = null;
		try {
			token = jwt.sign(tokenPayload, process.env.SECRET_KEY, { expiresIn: "1h" });
			console.log("Token generated: ", token);
		} catch (error) {
			 res.status(400).send({error: "Failed to generate JWT token."});
			 return;
		}

		 res.status(200).send({token, message: "authentication successful"});
		console.log("User authenticated: ", person);
		return;
	} catch {
		 res.status(400).json({ error: "error, failed to authenitcate"});
		return;
	}
};



//validateUserId function
async function validateUserId(req, res) {  
	try {
		const exists = await User.exists({ UserId: req.query.userId });
		
		if (exists !== null) res.status(200).send("User exists")
	    else res.status(404).json({ message: "User with specified ID not found." });
	} catch {
		res.status(400).json({ message: "Error retrieving the user." });
		//res.status(500).json({ message: "Error retrieving the user." });
	}
};


//uådateName function
const jwt = require('jsonwebtoken');

async function updateName(req, res) {
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

		if (user) res.json({ success: true, user });
		else 	  res.status(404).json({ success: false, message: "User not found" });

	} catch (error) {
		// jwt.verify() throws an error if token is invalid
		console.error(error);
		res.status(500).json({ success: false, error: "Internal Server Error" });
	}
};


//updateEmail function
async function updateEmail (req, res) {
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

		if (user) res.json({ success: true, user });
		else      res.status(404).json({ success: false, message: "User not found" });
	
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, error: "Internal Server Error" });
	}
};


//updatePassword function
async function updatePassword(req, res) {
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

		if (user) res.json({ success: true, user });
		else      res.status(404).json({ success: false, message: "User not found" });
	} catch (error) {
		// jwt.verify() throws an error if token is invalid
		console.error(error);
		res.status(500).json({ success: false, error: "Internal Server Error" });
	}
};


  
//getPassword function
async function getPassword (req, res) {
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

		if (user) res.json({ success: true, user });
		else      res.status(404).json({ success: false, message: "User not found" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, error: "Internal Server Error" });
	}
};




module.exports = { 
    createUser,
    userList,
    validateEmail,
    ValidateName, 
    ValidateLogin,
    validateUserId, 
    updateName,
    updateEmail,
    updatePassword,
    getPassword
};