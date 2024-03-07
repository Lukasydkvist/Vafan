// Import createUser function
const { createUser } = require("../api.js");

// Import the User model
const { User } = require("../db.js");

// Mock the dependencies (e.g., req, res, User model)

// Test suite for createUser function
describe("createUser", () => {
    test("should create a new user when provided with valid input", async () => {
        // Mock the request and response objects
        const req = {
            body: {
                Email: "test@example.com",
                Name: "Test User",
                Password: "password",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the User model methods
        User.count = jest.fn().mockResolvedValue(0); // Mocking the count method to return 0
        User.prototype.save = jest.fn(); // Mocking save method

        // Call the createUser function
        await createUser(req, res);

        // Assert that the response status is 200
        expect(res.status).toHaveBeenCalledWith(200);

        // Assert that the User model methods were called
        expect(User.count).toHaveBeenCalled();
        expect(User.prototype.save).toHaveBeenCalled();   
     });
});

// describe validateEmail
    // test 1: Not a valid email
    // test 2: A valid email
