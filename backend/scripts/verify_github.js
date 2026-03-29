const { getGitHubWeeklyProgress } = require('../services/githubService');

async function verify() {
    console.log('--- Verifying buildWeeklyArray Logic ---');
    
    // Mock events
    const today = new Date().toISOString().slice(0, 10);
    const mockEvents = [
        {
            type: 'PushEvent',
            created_at: today + 'T10:00:00Z',
            payload: { commits: [1, 2, 3] }
        }
    ];

    try {
        const weekly = await getGitHubWeeklyProgress('testuser', mockEvents);
        console.log('Weekly Progress:', JSON.stringify(weekly, null, 2));
        
        const todayEntry = weekly.find(day => day.date === new Date().toLocaleDateString('en-US', { weekday: 'short' }));
        if (todayEntry && todayEntry.count === 3) {
            console.log('✅ Success: Today\'s commits correctly counted.');
        } else {
            console.error('❌ Failure: Today\'s commits not correctly counted.', todayEntry);
        }
    } catch (error) {
        console.error('❌ Error during verification:', error.message);
    }
}

verify();
