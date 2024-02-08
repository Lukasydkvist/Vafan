const express = require("express"); 
const proxy = require("express-http-proxy");
const path = require("path");
const app = express(); 

const my_path = "../../../build/";
const { createProxyMiddleware } = require('http-proxy-middleware');


// Serve static files from the build folder
app.use(express.static(path.join(__dirname, my_path)));


app.use("/api/user", createProxyMiddleware({ target: "http://localhost:3002" }));
//app.get("/api/user", proxy("http://localhost:3002"));  


app.use("/api/main", proxy("http://localhost:3001"));  


// Handle requests to the root URL
app.get(["/", "/home", "/login", "/meetingScheduler"], (req, res) => {
	// Send the index.html file from the build folder as the response
	res.sendFile(path.join(__dirname, my_path, "index.html"));
});
app.listen(3000); 