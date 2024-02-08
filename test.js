async function test() {
    const response = await fetch("http://localhost:3000/api/user/ValidateEmail", {method: "POST",
				headers: {"Content-Type":"application/json"},
				body: JSON.stringify({ Email: "aronkesete11@gmail.com" })});
    console.log(await response)
}

test()