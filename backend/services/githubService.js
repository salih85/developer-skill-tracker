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

const buildActivityArray = (events, daysCount = 7) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days = [...Array(daysCount)].map((_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (daysCount - 1 - index))
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const key = `${year}-${month}-${day}`
    
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
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
        const commitCount = event.payload.size || 
                           event.payload.distinct_size || 
                           event.payload.commits?.length || 
                           1
        day.count += commitCount
      }
    })
  }

  return days
}

const getGitHubSummary = async (username) => {
  const profileResponse = await fetch(`https://api.github.com/users/${username}`, {
    headers: getGitHubHeaders(),
  })
  const profile = await profileResponse.json()

  if (!profileResponse.ok) {
    throw new Error(profile.message || 'GitHub profile not found')
  }

  // Fetch current year commit count from Search API for accuracy
  const currentYear = new Date().getFullYear()
  const searchResponse = await fetch(
    `https://api.github.com/search/commits?q=author:${username}+author-date:${currentYear}-01-01..${currentYear}-12-31`,
    {
      headers: {
        ...getGitHubHeaders(),
        Accept: 'application/vnd.github.cloak-preview',
      },
    }
  )
  const searchData = await searchResponse.json()
  const yearlyCommits = searchData.total_count || 0

  const eventsResponse = await fetch(
    `https://api.github.com/users/${username}/events/public?per_page=100`,
    {
      headers: getGitHubHeaders(),
    }
  )
  const events = await eventsResponse.json()

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
    company: profile.company || '',
    created_at: profile.created_at,
    commits: yearlyCommits, // Use total commits for current year
    events: Array.isArray(events) ? events : [],
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

const getGitHubLanguageStats = async (username) => {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100`,
    {
      headers: getGitHubHeaders(),
    }
  )
  const repos = await response.json()

  if (!response.ok) return []

  const languages = {}
  repos.forEach((repo) => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1
    }
  })

  return Object.entries(languages)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

const getGitHubRecentActivity = async (username, events = null) => {
  let activityEvents = events
  if (!activityEvents) {
    const response = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=20`,
      {
        headers: getGitHubHeaders(),
      }
    )
    activityEvents = await response.json()
  }

  if (!Array.isArray(activityEvents)) return []

  return activityEvents.slice(0, 15).map((event) => {
    let description = ''
    switch (event.type) {
      case 'PushEvent':
        description = `Pushed ${event.payload.commits?.length || 1} commits stack to ${event.repo.name}`
        break
      case 'CreateEvent':
        description = `Created ${event.payload.ref_type} ${event.payload.ref || ''} in ${event.repo.name}`
        break
      case 'WatchEvent':
        description = `Starred ${event.repo.name}`
        break
      case 'PullRequestEvent':
        description = `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} pull request in ${event.repo.name}`
        break
      case 'IssuesEvent':
        description = `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} issue in ${event.repo.name}`
        break
      default:
        description = `${event.type.replace('Event', '')} in ${event.repo.name}`
    }

    return {
      type: event.type,
      repo: event.repo.name,
      description,
      date: event.created_at,
    }
  })
}

const getGitHubActivityHistory = async (username, existingEvents = null) => {
  let events = existingEvents

  if (!events) {
    const eventsResponse = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=100`,
      {
        headers: getGitHubHeaders(),
      }
    )
    events = await eventsResponse.json()
  }

  return buildActivityArray(events, 30) // Return 30 days
}

const getGitHubYearlyStats = async (username) => {
  const currentYear = new Date().getFullYear()
  const years = [currentYear, currentYear - 1, currentYear - 2]

  const fetchYearlyCount = async (year) => {
    try {
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
    } catch (e) {
      return 0
    }
  }

  const results = {}
  await Promise.all(
    years.map(async (year) => {
      results[year] = await fetchYearlyCount(year)
    })
  )

  return results
}

module.exports = {
  getGitHubSummary,
  getGitHubActivityHistory,
  getGitHubYearlyStats,
  getGitHubTopRepos,
  getGitHubLanguageStats,
  getGitHubRecentActivity,
}


