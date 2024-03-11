//Import validateEmail function 
const { validateEmail } = require("../api.js"); 

// Import the User model 
const { User } = require("../db.js");

// Mock the dependencies (e.g., req, res, User model)

// Test validateEmail where the eamil is not registered in the databases
describe("validateEmail", () => {
    test("should return an error when provided with an invalid email", async () => {
        // Mock the request and response objects
        const req = {
            body: {
                Email: "test@example", // Invalid email format 
            }, 
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }; 
        

        // Mock the User.findOne method
        User.findOne = jest.fn().mockResolvedValue(null); // Assuming no user found with this email
        
        // Call the validateEmail function
        await validateEmail(req, res);

        // Assert that the response status is 400
        expect(res.status).toHaveBeenCalledWith(400);

        // Assert that the appropriate error message is sent in the response
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to insert into database" });
    });

});
