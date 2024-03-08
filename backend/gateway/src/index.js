const express = require("express"); 
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require("path");
const cors = require('cors');
const ports = require("../../ports");
const probeServer = require("../../probing");

const buildPath = "../../../frontend/build";

function createProxy(devUrl, prodUrl) {
    return createProxyMiddleware({ target: process.env.NODE_ENV === "development" ? devUrl : prodUrl });
}

// Create the server
const app = express(); 
probeServer(app);

// Setup CORS
app.use(cors());

// Log incoming requests
app.use((req, res, next) => {
	console.log(`Received request: ${req.method} ${req.originalUrl}`);
	next();
})

// Serve static files from the build folder
app.use(express.static(path.join(__dirname, buildPath)));
app.get(["/"], (req, res) => { res.sendFile(path.join(__dirname, my_path, "index.html")) });

// Proxy the request for the API to the microservices
app.use("/api/user", createProxy(`http://localhost:${ports.user}`, "http://user-microservice"));
app.use("/api/meet", createProxy(`http://localhost:${ports.meeting}`, "http://meeting-microservice"));

// Start the server and listen on the port 'gateway
app.listen(ports.gateway, () => console.log(`Server listening on http://localhost:${ports.gateway}`)); 
