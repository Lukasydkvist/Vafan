const jwt = require('jsonwebtoken');
// Import the updateName function
const { updateName } = require("../api.js");

// Import the User model
const { User } = require("../db.js");


// Mock the jsonwebtoken module
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

describe("updateName", () => {
//test 1 : should pass the test  the inmut is invalid token
    test("should update the user's name when provided with a valid token and new name", async () => {
        // Mock the request and response objects
        const req = {
            header: jest.fn().mockReturnValue('Bearer validToken'),
            body: { newName: 'New Name' },
        };
        const res = {
            json: jest.fn(),
        };

        // Mock the jwt.verify function to return the decoded user ID
        jwt.verify.mockReturnValue({ userId: '123' });

        // Mock the User.findOneAndUpdate method
        User.findOneAndUpdate = jest.fn().mockResolvedValue({ name: 'New Name' });

        // Call the updateName function
        await updateName(req, res);

        // Assert that the response contains the updated user object
        expect(res.json).toHaveBeenCalledWith({ success: true, user: { name: 'New Name' } });
    });

//test 2 : should return 404 status code for user not found
    test("should return 404 status code for user not found", async () => {
        // Mock the request and response objects
        const req = {
            header: jest.fn().mockReturnValue('Bearer validToken'),
            body: { newName: 'New Name' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the jwt.verify function to return the decoded user ID
        jwt.verify.mockReturnValue({ userId: '123' });

        // Mock the User.findOneAndUpdate method to return null
        User.findOneAndUpdate = jest.fn().mockResolvedValue(null);

        // Call the updateName function
        await updateName(req, res);

        // Assert that the response status is 404 and contains an appropriate error message
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'User not found' });
    });




 /*
//test 3 : for invalid or expired token 
    test("should return 401 status code for invalid or expired token", async () => {
        // Mock the request and response objects
        const req = {
            header: jest.fn().mockReturnValue('Bearer invalidToken'),
            body: { newName: 'New Name' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the jwt.verify function to throw an error
        jwt.verify.mockImplementation(() => {
            throw new Error('JWT verification error');
        });

        // Call the updateName function
        await updateName(req, res);

        // Assert that the response status is 401 and contains an appropriate error message
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Invalid or expired token' });
    });
    

   
    
    test('should return 500 status code for unexpected errors', async () => {
        // Mock the jwt.verify function to return an error
        jwt.verify.mockImplementation(() => {
            throw new Error('JWT verification error');
        });

        const req = {
            header: jest.fn().mockReturnValue('Bearer validToken'),
            body: { newName: 'New Name' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mocking User.findOneAndUpdate to throw an error
        User.findOneAndUpdate = jest.fn().mockRejectedValueOnce(new Error('Database error'));

        await updateName(req, res);

        // Assert that the response status is 500 and contains an appropriate error message
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Internal Server Error' });
    });

  */

    //////////////////////////////
});
