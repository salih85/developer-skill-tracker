const fetch = require('node-fetch')

const getGitHubHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
  }

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`
  }

  return headers
}

const buildWeeklyArray = (events) => {
  const today = new Date()
  const days = [...Array(7)].map((_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      key: date.toISOString().slice(0, 10),
      count: 0,
    }
  })

  events.forEach((event) => {
    if (event.type !== 'PushEvent') return
    const dateKey = event.created_at.slice(0, 10)
    const day = days.find((item) => item.key === dateKey)
    if (day) {
      day.count += event.payload.commits?.length || 0
    }
  })

  return days.map(({ date, count }) => ({ date, count }))
}

const getGitHubSummary = async (username) => {
  const profileResponse = await fetch(`https://api.github.com/users/${username}`, {
    headers: getGitHubHeaders(),
  })
  const profile = await profileResponse.json()

  if (!profileResponse.ok) {
    throw new Error(profile.message || 'GitHub profile not found')
  }

  const eventsResponse = await fetch(
    `https://api.github.com/users/${username}/events/public?per_page=100`,
    {
      headers: getGitHubHeaders(),
    }
  )
  const events = await eventsResponse.json()

  if (!eventsResponse.ok) {
    throw new Error(events.message || 'Unable to load GitHub activity')
  }

  const commits = events.reduce((total, event) => {
    if (event.type !== 'PushEvent') {
      return total
    }
    return total + (event.payload.commits?.length || 0)
  }, 0)

  return {
    username: profile.login,
    avatar: profile.avatar_url,
    repos: profile.public_repos,
    followers: profile.followers,
    bio: profile.bio || '',
    commits,
  }
}

const getGitHubWeeklyProgress = async (username) => {
  const eventsResponse = await fetch(
    `https://api.github.com/users/${username}/events/public?per_page=100`,
    {
      headers: getGitHubHeaders(),
    }
  )
  const events = await eventsResponse.json()

  if (!eventsResponse.ok) {
    throw new Error(events.message || 'Unable to load GitHub activity')
  }

  return buildWeeklyArray(events)
}

module.exports = {
  getGitHubSummary,
  getGitHubWeeklyProgress,
}
