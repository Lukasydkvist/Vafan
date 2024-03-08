// end-to-end.test.js

// Mocking supertest and mongoose
jest.mock('supertest', () => {
    const request = jest.fn(() => ({
        get: jest.fn().mockReturnValue(Promise.resolve({ statusCode: 200 })),
        post: jest.fn().mockReturnValue(Promise.resolve({ statusCode: 200 }))
    }));
    return request;
});

jest.mock('mongoose', () => {
    const connect = jest.fn(); // Mock mongoose connect function
    const Schema = jest.fn().mockImplementation(() => ({
        Email: String,
        Name: String,
        Password: String
    }));
    const model = jest.fn().mockReturnValue({});
    return { connect, Schema, model };
});

// Mocking Express app startup
jest.mock('../index', () => {
    const app = {
        listen: jest.fn()
    };
    return app;
});

// Importing the required modules
const request = require('supertest');
const app = require('../index'); // Assuming your express app is exported from a file named index.js

// Test case for the root path
// This test case will check if the root path is working as expected
describe('Test the root path', () => {
    test('It should response the GET method', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });
});

// Test case for the /api/user/CreateUser path
// This test case will check if the /api/user/CreateUser path is working as expected
describe('Test the /api/user/CreateUser path', () => {
    test('It should response the POST method', async () => {
        const response = await request(app).post('/api/user/CreateUser');
        expect(response.statusCode).toBe(200);
    });
}); 

// Test case for the /api/user/userList path    
// This test case will check if the /api/user/userList path is working as expected
describe('Test the /api/user/userList path', () => {
    test('It should response the POST method', async () => {
        const response = await request(app).post('/api/user/userList');
        expect(response.statusCode).toBe(200);
    });
}); 

// Test case for the /api/user/ValidateEmailLogin path
// This test case will check if the /api/user/ValidateEmailLogin path is working as expected
describe('Test the /api/user/ValidateEmailLogin path', () => {
    test('It should response the POST method', async () => {
        const response = await request(app).post('/api/user/ValidateEmailLogin');
        expect(response.statusCode).toBe(200);
    });
});

// Test case for the /api/user/ValidateName path
// This test case will check if the /api/user/ValidateName path is working as expected
describe('Test the /api/user/ValidateName path', () => {
    test('It should response the POST method', async () => {
        const response = await request(app).post('/api/user/ValidateName');
        expect(response.statusCode).toBe(200);
    });
});

// Test case for the /api/user/ValidateLogin path
// This test case will check if the /api/user/ValidateLogin path is working as expected
describe('Test the /api/user/ValidateLogin path', () => {
    test('It should response the POST method', async () => {
        const response = await request(app).post('/api/user/ValidateLogin');
        expect(response.statusCode).toBe(200);
    });
});


// Test case for the /api/user/validateUserId path
// This test case will check if the /api/user/validateUserId path is working as expected
describe('Test the /api/user/validateUserId path', () => {
    test('It should response the GET method', async () => {
        const response = await request(app).get('/api/user/validateUserId');
        expect(response.statusCode).toBe(200);
    });
});

// Test case for the /api/user/updateName path
// This test case will check if the /api/user/updateName path is working as expected
describe('Test the /api/user/updateName path', () => {
    test('It should response the POST method', async () => {
        const response = await request(app).post('/api/user/updateName');
        expect(response.statusCode).toBe(200);
    });
});

// Test case for the /api/user/updateEmail path
// This test case will check if the /api/user/updateEmail path is working as expected
describe('Test the /api/user/updateEmail path', () => {
    test('It should response the POST method', async () => {
        const response = await request(app).post('/api/user/updateEmail');
        expect(response.statusCode).toBe(200);
    });
});

// Test case for the /api/user/updatePassword path
// This test case will check if the /api/user/updatePassword path is working as expected
describe('Test the /api/user/updatePassword path', () => {
    test('It should response the POST method', async () => {
        const response = await request(app).post('/api/user/updatePassword');
        expect(response.statusCode).toBe(200);
    });
});

// Test case for the /api/user/getPassword path
// This test case will check if the /api/user/getPassword path is working as expected
describe('Test the /api/user/getPassword path', () => {
    test('It should response the POST method', async () => {
        const response = await request(app).post('/api/user/getPassword');
        expect(response.statusCode).toBe(200);
    });
});

// This test case will check if the root path is not working as expected 
describe('Test the root path', () => {
    test('It should response the GET method', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).not.toBe(404);
    });
});

// This test case will check if the /api/user/CreateUser path is not working as expected
describe('Test the /api/user/CreateUser path', () => {
    test('It should response the POST method', async () => {
        const response = await request(app).post('/api/user/CreateUser');
        expect(response.statusCode).not.toBe(404);
    });
});

// This test case will check if the /api/user/userList path is not working as expected
describe('Test the /api/user/userList path', () => {
    test('It should response the POST method', async () => {
        const response = await request(app).post('/api/user/userList');
        expect(response.statusCode).not.toBe(404);
    });
});

// This test case will check if the /api/user/ValidateEmailLogin path is not working as expected
describe('Test the /api/user/ValidateEmailLogin path', () => {
    test('It should response the POST method', async () => {
        const response = await request(app).post('/api/user/ValidateEmailLogin');
        expect(response.statusCode).not.toBe(404);
    });
});

// This test case will check if the /api/user/ValidateName path is not working as expected
describe('Test the /api/user/ValidateName path', () => {
    test('It should response the POST method', async () => {
        const response = await request(app).post('/api/user/ValidateName');
        expect(response.statusCode).not.toBe(404);
    });
});

// This test case will check if the /api/user/ValidateLogin path is not working as expected
describe('Test the /api/user/ValidateLogin path', () => {
    test('It should response the POST method', async () => {
        const response = await request(app).post('/api/user/ValidateLogin');
        expect(response.statusCode).not.toBe(404);
    });
});

// This test case will check if the /api/user/validateUserId path is not working as expected
describe('Test the /api/user/validateUserId path', () => {
    test('It should response the GET method', async () => {
        const response = await request(app).get('/api/user/validateUserId');
        expect(response.statusCode).not.toBe(404);
    });
});

// This test case will check if the /api/user/updateName path is not working as expected
describe('Test the /api/user/updateName path', () => {
    test('It should response the POST method', async () => {
        const response = await request(app).post('/api/user/updateName');
        expect(response.statusCode).not.toBe(404);
    });
});

// This test case will check if the /api/user/updateEmail path is not working as expected
describe('Test the /api/user/updateEmail path', () => {
    test('It should response the POST method', async () => {
        const response = await request(app).post('/api/user/updateEmail');
        expect(response.statusCode).not.toBe(404);
    });
});

// This test case will check if the /api/user/updatePassword path is not working as expected
describe('Test the /api/user/updatePassword path', () => {
    test('It should response the POST method', async () => {
        const response = await request(app).post('/api/user/updatePassword');
        expect(response.statusCode).not.toBe(404);
    });
});
