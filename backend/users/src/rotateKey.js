const cron = require("node-cron");
const { generateSecretKey, generateSecretKeySync } = require("../src/generateSecretKey");
const fs = require("fs");
const dotenv = require("dotenv");

// # <minute> <hour> <day of month> <month> <day of week>
// #  0-59     0-23      1-31        1-12    0-7 (Sunday = 0 or 7)   
//
// # 0 3 * * *    would run the command every day at 3:00 AM.
// # */15 * * * * would run the command every 15 minutes.
// # 0 0 * * 1    would run the command every Monday at midnight.
// # 0 0 1 * *    would run the command at midnight on the first day of every month

// # Each field must contain a valid numerical value or one of the
// # special characters (* / - ,). Be cautious with the time zone differences when
// # scheduling cron jobs, as they run based on the system's local time zone.

async function startCronJob() {
	// Initial check to see if .env exists, SECRET_KEY exists and has a value
	// If not, create and give an initial random hexadecimal string
	if (!fs.existsSync(".env") || !process.env.SECRET_KEY || process.env.SECRET_KEY.length < 512) {
		fs.writeFileSync(".env", "");

		// Sets an initial random hexadecimal string
		const newKey = await generateSecretKeySync();

		// Write the newKey to the .env file
		dotenv.config(); // Load existing .env file into process.env
		process.env.SECRET_KEY = newKey; // Update SECRET_KEY in process.env
		fs.writeFileSync(".env", `SECRET_KEY=${newKey}`); // Update .env file
	}

	// run every midnight
	cron.schedule("0 0 * * *", async () => {
		try {
			// Generate a new random hexadecimal string
			const newKey = await generateSecretKey();

			// Check if the .env file exists, create one if it doesn't
			if (!fs.existsSync(".env")) {
				fs.writeFileSync(".env", "");
			}

			// Write the newKey to the .env file
			dotenv.config(); // Load existing .env file into process.env
			process.env.SECRET_KEY = newKey; // Update SECRET_KEY in process.env
			fs.writeFileSync(".env", `SECRET_KEY=${newKey}`); // Update .env file
		} catch (error) {
			console.error("Error generating or writing secret key:", error);
		}
	});
}

module.exports = { startCronJob };
