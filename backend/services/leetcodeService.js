const fetch = require('node-fetch')

const LEETCODE_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        reputation
        ranking
        userAvatar
        realName
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`

const getLeetCodeSummary = async (username) => {
  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: LEETCODE_QUERY,
      variables: { username },
    }),
  })

  const data = await response.json()
  const profile = data?.data?.matchedUser

  if (!profile) {
    throw new Error('LeetCode profile not found')
  }

  const allStats = profile.submitStats.acSubmissionNum.find(
    (item) => item.difficulty === 'All'
  )

  return {
    username: profile.username,
    solved: allStats?.count || 0,
    ranking: profile.profile.ranking || 0,
    reputation: profile.profile.reputation || 0,
    avatar: profile.profile.userAvatar || null,
  }
}

module.exports = {
  getLeetCodeSummary,
}
