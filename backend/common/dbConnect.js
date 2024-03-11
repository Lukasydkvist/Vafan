const mongoose = require("mongoose");

//url to DB
const url = "mongodb+srv://test:test@scalablecoursecluster.tojxfc3.mongodb.net/?retryWrites=true&w=majority&appName=ScalableCourseCluster"; 

//connect to db
async function connect() {
	try{
		await mongoose.connect(url);
		console.log("Connected to database.");
	}
	catch(error) {
		console.error(error);
	}
}

module.exports = connect;