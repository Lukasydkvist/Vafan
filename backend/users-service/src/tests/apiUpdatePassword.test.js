// Import updatePassword function from api.js
const { updatePassword,validateEmail } = require("../api.js");

// Import the User model
const { User } = require("../db.js");

// Mock the jwt module
jest.mock("jsonwebtoken", () => ({
    verify: jest.fn().mockReturnValue({ userId: "user123" })
}));

// Test suite for updatePassword function
describe("updatePassword", () => {
 
// Test 1: Update password with valid input ////////////// is mising 

    // Test 2: User not found
    test("should return 404 if user not found", async () => {
        // Mock the request and response objects
        const req = {
            body: {
                newPassword: "newPassword123",
            },
            header: jest.fn().mockReturnValue("Bearer validtoken"), // Mocking the header function to return a valid token
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the User model method to return null (user not found)
        User.findOneAndUpdate = jest.fn().mockResolvedValue(null);

        // Call the updatePassword function
        await updatePassword(req, res);

        // Assert that the response status is 404
        expect(res.status).toHaveBeenCalledWith(404);

        // Assert that the response JSON includes the appropriate message
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "User not found" });
    });
});

