const { getGitHubSummary, getGitHubWeeklyProgress } = require('./backend/services/githubService');

async function test() {
    const username = 'octocat'; // Using octocat as a test case
    try {
        console.log('Fetching summary for:', username);
        const summary = await getGitHubSummary(username);
        console.log('Summary:', JSON.stringify(summary, null, 2));

        console.log('Fetching weekly progress for:', username);
        const weekly = await getGitHubWeeklyProgress(username);
        console.log('Weekly:', JSON.stringify(weekly, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

test();
