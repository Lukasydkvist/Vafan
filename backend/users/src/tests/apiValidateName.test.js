//Import ValidateName function 
const { ValidateName } = require("../api.js");

// Import the User model
const { User } = require("../db.js");

// Mock the dependencies (e.g., req, res, User model)

// Test validateName 
describe("ValidateName", () => {
    test("should return an error when provided with an invalid name", async () => {
        // Mock the request and response objects
        const req = {
            body: {
                Name: "Test User", // Invalid name format 
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the User.findOne method
        User.findOne = jest.fn().mockResolvedValue(null); // Assuming no user found with this name

        // Call the validateName function
        await ValidateName(req, res);

        // Assert that the response status is 400
        expect(res.status).toHaveBeenCalledWith(400);

        // Assert that the appropriate error message is sent in the response
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to insert into database" });
    });

});