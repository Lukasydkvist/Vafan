//import ValidateLogin function 
const { ValidateLogin } = require("../api");

// Import the User model
const { User } = require("../db");

// Mock the dependencies (e.g., req, res, User model)

// Test validateLogin
describe("ValidateLogin", () => {
    // Test 1: should return an error when provided with an empty email 
    test("should return an error when provided with an invalid email", async () => {
        // Mock the request and response objects
        const req = {
            body: {
                Email: "    ", // Invalid email format  
                Password: "password",
            },
        };      
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Call the validateLogin function
        await ValidateLogin(req, res);

        // Assert that the response status is 400
        expect(res.status).toHaveBeenCalledWith(400);

        // Assert that the appropriate error message is sent in the response
        expect(res.json).toHaveBeenCalledWith({ error: "error, failed to authenitcate" });
    }, 30000); // Added timeout value here

    // Test 2: should return an error when provided with an empty password
    test("should return an error when provided with an invalid password", async () => {
        // Mock the request and response objects
        const req = {
            body: {
                Email: "test@exampl.com", // Invalid email format
                Password: "    ", // Invalid password format
            },  
        };      
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
                
        // Call the validateLogin function
        await ValidateLogin(req, res);

        // Assert that the response status is 400
        expect(res.status).toHaveBeenCalledWith(400); 

        // Assert that the appropriate error message is sent in the response
        expect(res.json).toHaveBeenCalledWith({ error: "error, failed to authenitcate" });
    }, 30000);

// Test 3: should return an error when provided with an invalid email format 
    test("should return an error when provided with an invalid email format", async () => {
        // Mock the request and response objects
        const req = {
            body: {
                Email: "invalied_email_format", // Invalid email format
                Password: "password",   
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Call the validateLogin function
        await ValidateLogin(req, res);

        // Assert that the response status is 400
        expect(res.status).toHaveBeenCalledWith(400);

        // Assert that the appropriate error message is sent in the response
        expect(res.json).toHaveBeenCalledWith({ error: "error, failed to authenitcate" });
    }, 30000); // Added timeout value here

// Test 4: should return an error when provided with an incorrect password 
    test("should return an error when provided with an incorrect password", async () => {
        // Mock the request and response objects
        const req = {
            body: {
                Email: "test@exampl.com", // Valid email format
                Password: "incorrect_password", // Incorrect password   
            },
        };  
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the User model method
        User.findOne = jest.fn().mockResolvedValue(null); // Mocking the findOne method to return null

        // Call the validateLogin function
        await ValidateLogin(req, res);

        // Assert that the response status is 400
        expect(res.status).toHaveBeenCalledWith(400);

        // Assert that the appropriate error message is sent in the response
        expect(res.json).toHaveBeenCalledWith({ error: "error, failed to authenitcate" });
    }
    , 30000); // Added timeout value here

    //////////////////////////////////////////
});
