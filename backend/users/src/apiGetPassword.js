// Mock the jsonwebtoken module
jest.mock("jsonwebtoken", () => ({
    verify: jest.fn().mockReturnValue({ userId: "someUserId" })
}));

const { getPassword } = require('../api.js');
const { User } = require("../db.js");

describe('Test the getPassword function', () => {
    test('It should respond with status 200', async () => {
        const userId = 'someUserId';
        const user = { Password: 'somePassword' }; // Mock user object
        
        // Mocking req and res objects
        const req = {
            header: jest.fn().mockReturnValue(`Bearer ${userId}`) // Mocking the header function to return a token
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        // Mocking the User.findOne function to return a user
        jest.spyOn(User, 'findOne').mockResolvedValue(user); // Mocking the User model

        // Call the getPassword function
        await getPassword(req, res);

        // Assert that the response status is 200
        expect(res.status).toHaveBeenCalledWith(200);
        // Assert that the response contains the user object
        expect(res.json).toHaveBeenCalledWith({ success: true, user });
    });

    // Add more test cases as needed
});
