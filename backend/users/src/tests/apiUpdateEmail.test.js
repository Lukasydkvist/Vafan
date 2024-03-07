const jwt = require('jsonwebtoken'); // Import jwt

//Impor function updateEmail from api.js
const { updateEmail } = require("../api.js");

// Import the User model
const { User } = require("../db.js");

// Mock the jsonwebtoken module
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

describe("updateEmail", () => {
    //test 1 : should update the user's email when provided with a valid token and new email
    test("should update the user's email when provided with a valid token and new email", async () => {
        // Mock the request and response objects
        const req = {
            header: jest.fn().mockReturnValue('Bearer validToken'),
            body: { newEmail: '         ' },    //new email is empty        
        };  
        const res = {
            json: jest.fn(),
        };

        // Mock the jwt.verify function to return the decoded user ID
        jwt.verify.mockReturnValue({ userId: '123' });

        // Mock the User.findOneAndUpdate method    
        User.findOneAndUpdate = jest.fn().mockResolvedValue({ email: 'New Email' });

        // Call the updateEmail function
        await updateEmail(req, res);

        // Assert that the response contains the updated user object
        expect(res.json).toHaveBeenCalledWith({ success: true, user: { email: 'New Email' } });
    }
    );
    
    
    
    
    //test 2 : should return 404 status code for user not found
    test("should return 404 status code for user not found", async () => {
        // Mock the request and response objects
        const req = {
            header: jest.fn().mockReturnValue('Bearer validToken'),
            body: { newEmail: 'newEmail' },    
        };  
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the jwt.verify function to return the decoded user ID
        jwt.verify.mockReturnValue({ userId: '123' });

        // Mock the User.findOneAndUpdate method to return null
        User.findOneAndUpdate = jest.fn().mockResolvedValue(null);

        // Call the updateEmail function
        await updateEmail(req, res);

        // Assert that the response contains the updated user object
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "User not found" });
    }
    );

//////////////////////////////
 }
);