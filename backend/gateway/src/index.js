const express = require("express"); 
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require("path");
const cors = require('cors');
const ports = require("../../ports");

const buildPath = "../../../frontend/build";

// Create the server
const app = express(); 

// Setup CORS
app.use(cors());

// Serve static files from the build folder
app.use(express.static(path.join(__dirname, buildPath)));
app.get(["/"], (req, res) => { res.sendFile(path.join(__dirname, my_path, "index.html")) });

// Proxy the request for the API to the microservices
app.use("/api/user", createProxyMiddleware({ target: `http://localhost:${ports.user}` }));
app.use("/api/meet", createProxyMiddleware({ target: `http://localhost:${ports.meeting}` }));

// Start the server and listen on the port 'gateway
app.listen(ports.gateway, () => console.log(`Server listening on http://localhost:${ports.gateway}`)); 
