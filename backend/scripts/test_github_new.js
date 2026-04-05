const fetch = require('node-fetch');

async function testStats() {
    const response = await fetch('http://localhost:5000/api/stats/github/detailed', {
        headers: {
            'Authorization': 'Bearer YOUR_TOKEN_HERE' 
        }
    });
   
    console.log("Status:", response.status);
}


