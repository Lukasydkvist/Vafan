//Import validateUserId function 
const { validateUserId } = require("../api.js");

// Import the User model
const { User } = require("../db.js");

// Mock the dependencies (e.g., req, res, User model)

// Test validateUserId
describe("validateUserId", () => { 
    // Test 1: should return an error when provided with an invalid userId
    test("should return an error when provided with an invalid userId", async () => {
        // Mock the request and response objects
        const req = {
            body: {
                userId: "    ", // Invalid userId format  
            },
        };      
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Call the validateUserId function
        await validateUserId(req, res);

        // Assert that the response status is 400
        expect(res.status).toHaveBeenCalledWith(400);

        // Assert that the appropriate error message is sent in the response
        expect(res.json).toHaveBeenCalledWith({ message: "Error retrieving the user." }); // Update to match the actual error message
    }); 


// Test 2: should return success when provided with a valid userId
test("should return success when provided with a valid userId", async () => {
    // Mock the request and response objects
    const req = {
        query: {
            userId: "validUserId", // Valid userId 
        },
    };      
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
    };

    // Mock the User model methods
    User.exists = jest.fn().mockResolvedValue(true); // Mocking the exists method to return true

    // Call the validateUserId function
    await validateUserId(req, res);

    // Assert that the response status is 200
    expect(res.status).toHaveBeenCalledWith(200);

    // Assert that the user exists message is sent in the response body
    expect(res.send).toHaveBeenCalledWith("User exists");   
});


// Test 3: should return error when provided with a non-existent userId 
    
/////////////////////////////////////////////////////////////
    
});
