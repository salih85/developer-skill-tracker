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
        // Fallback: if size or commits are missing, count as 1 push = at least 1 commit
        const commitCount = event.payload.size || 
                           event.payload.distinct_size || 
                           event.payload.commits?.length || 
                           1
        day.count += commitCount
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
        // Fallback here too
        const commitCount = event.payload.size || 
                           event.payload.distinct_size || 
                           event.payload.commits?.length || 
                           1
        return total + commitCount
      }, 0)
    : 0

  return {
    username: profile.login,
    name: profile.name || profile.login,
    avatar: profile.avatar_url,
    repos: profile.public_repos,
    followers: profile.followers,
    following: profile.following,
    bio: profile.bio || '',
    location: profile.location || '',
    blog: profile.blog || '',
    commits,
    events: Array.isArray(events) ? events : [], // Keep events for weekly progress if needed
  }
}

const getGitHubTopRepos = async (username) => {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
    {
      headers: getGitHubHeaders(),
    }
  )
  const repos = await response.json()

  if (!response.ok) {
    throw new Error(repos.message || 'Unable to load GitHub repositories')
  }

  return repos.map((repo) => ({
    name: repo.name,
    description: repo.description,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    url: repo.html_url,
    updated_at: repo.updated_at,
  }))
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

const getGitHubYearlyStats = async (username) => {
  const currentYear = new Date().getFullYear()
  const lastYear = currentYear - 1

  const fetchYearlyCount = async (year) => {
    const response = await fetch(
      `https://api.github.com/search/commits?q=author:${username}+author-date:${year}-01-01..${year}-12-31`,
      {
        headers: {
          ...getGitHubHeaders(),
          Accept: 'application/vnd.github.cloak-preview',
        },
      }
    )
    const data = await response.json()
    return data.total_count || 0
  }

  const [count2026, count2025] = await Promise.all([
    fetchYearlyCount(2026),
    fetchYearlyCount(2025),
  ])

  return {
    2026: count2026,
    2025: count2025,
  }
}

module.exports = {
  getGitHubSummary,
  getGitHubWeeklyProgress,
  getGitHubYearlyStats,
  getGitHubTopRepos,
}


