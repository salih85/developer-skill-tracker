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
  today.setHours(0, 0, 0, 0) // Normalize to start of day local time

  const days = [...Array(7)].map((_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))
    
    // We use a simple YYYY-MM-DD string for comparison
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const key = `${year}-${month}-${day}`
    
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      key,
      count: 0,
    }
  })

  if (Array.isArray(events)) {
    events.forEach((event) => {
      if (event.type !== 'PushEvent' || !event.created_at) return
      const dateKey = event.created_at.slice(0, 10)
      const day = days.find((item) => item.key === dateKey)
      if (day) {
        day.count += event.payload.commits?.length || 0
      }
    })
  }

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

  const commits = Array.isArray(events) 
    ? events.reduce((total, event) => {
        if (event.type !== 'PushEvent') return total
        return total + (event.payload.commits?.length || 0)
      }, 0)
    : 0

  return {
    username: profile.login,
    avatar: profile.avatar_url,
    repos: profile.public_repos,
    followers: profile.followers,
    bio: profile.bio || '',
    commits,
    events: Array.isArray(events) ? events : [], // Keep events for weekly progress if needed
  }
}

const getGitHubWeeklyProgress = async (username, existingEvents = null) => {
  let events = existingEvents

  if (!events) {
    const eventsResponse = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=100`,
      {
        headers: getGitHubHeaders(),
      }
    )
    events = await eventsResponse.json()

    if (!eventsResponse.ok) {
      throw new Error(events.message || 'Unable to load GitHub activity')
    }
  }

  return buildWeeklyArray(events)
}

module.exports = {
  getGitHubSummary,
  getGitHubWeeklyProgress,
}

