const testSignup = async () => {
    const testUser = {
        name: "Test User " + Date.now(),
        email: "test" + Date.now() + "@example.com",
        password: "password123",
        role: "user"
    };

    console.log("Attempting signup for:", testUser.email);

    try {
        const res = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });

        const data = await res.json();
        console.log("Response Status:", res.status);
        console.log("Response Data:", data);

        if (res.ok) {
            console.log("Signup successful!");
        } else {
            console.log("Signup failed.");
        }
    } catch (err) {
        console.error("Fetch Error:", err);
    }
};

testSignup();
