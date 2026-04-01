const fetch = require('node-fetch');

async function testStats() {
    const response = await fetch('http://localhost:5000/api/stats/github/detailed', {
        headers: {
            'Authorization': 'Bearer YOUR_TOKEN_HERE' // This will likely fail without a valid token
        }
    });
    // Since I can't easily get a valid user token in this environment without logging in, 
    // I'll check the terminal output for nodemon logs.
    console.log("Status:", response.status);
}

// I'll skip running this as I can't easily provide a token.
// Instead, I'll trust the nodemon logs if they show any errors during my edits.
