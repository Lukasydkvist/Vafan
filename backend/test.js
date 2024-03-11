console.log("Hej på dig")

async function test() {
    // Send request to the /api/user/CreateUser endpoint
    const response = await fetch("http://localhost:3001/api/user/CreateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            Email: "test",
            Name: "test",
            Password: "test"
        })
    });

    // Log the response
    
    // Log status
    console.log(response.status)
}

test()