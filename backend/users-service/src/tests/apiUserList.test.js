//write unitest for a userlist function
const userlist = require("../api.js").userList;

// Import the User model
const { User } = require("../db.js");

// Test suite for userList function
describe("userList", () => {
    test("should return a list of users", async () => {
        // Mock the request and response objects
        const req = {};
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        // Mock the User model methods
        User.find = jest.fn().mockResolvedValue([{ Name: "Test User1", UserId: 1}]);

        // Call the userList function
        await userlist(req, res);

        // Assert that the response status is 200
        expect(res.status).toHaveBeenCalledWith(200);

        // Assert that the User model methods were called
        expect(User.find).toHaveBeenCalled();
    });
});