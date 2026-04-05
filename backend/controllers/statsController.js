const User = require('../models/User')
const Stats = require('../models/Stats')
const { 
  getGitHubSummary, 
  getGitHubActivityHistory, 
  getGitHubYearlyStats, 
  getGitHubTopRepos,
  getGitHubLanguageStats,
  getGitHubRecentActivity
} = require('../services/githubService')
const { getLeetCodeSummary } = require('../services/leetcodeService')


const getOverview = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    const overview = {
      github: null,
      leetcode: null,
      weekly: [],
    }

    
    const tasks = []

    if (user.githubUsername) {
      tasks.push(
        getGitHubSummary(user.githubUsername)
          .then(async (summary) => {
            overview.github = summary
 
            const history = await getGitHubActivityHistory(user.githubUsername, summary.events)
            overview.weekly = history.slice(-7)
          })
          .catch((err) => console.error('GitHub fetch error:', err.message))
      )
    }

    if (user.leetcodeUsername) {
      tasks.push(
        getLeetCodeSummary(user.leetcodeUsername)
          .then((stats) => {
            overview.leetcode = stats
          })
          .catch((err) => console.error('LeetCode fetch error:', err.message))
      )
    }

    await Promise.all(tasks)


    try {
      await Stats.findOneAndUpdate(
        { user: req.user.id },
        {
          githubCommits: overview.github?.commits || 0,
          leetcodeSolved: overview.leetcode?.solved || 0,
          weeklyProgress: overview.weekly,
        },
        { new: true, upsert: true }
      )
    } catch (dbError) {
      console.error('Database update error:', dbError.message)
    }

    res.json({ overview })
  } catch (error) {
    next(error)
  }
}


const getGitHubStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user || !user.githubUsername) {
      res.status(404)
      throw new Error('GitHub profile not configured')
    }

    const summary = await getGitHubSummary(user.githubUsername)
    res.json(summary)
  } catch (error) {
    next(error)
  }
}

const getLeetCodeStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user || !user.leetcodeUsername) {
      res.status(404)
      throw new Error('LeetCode profile not configured')
    }

    const stats = await getLeetCodeSummary(user.leetcodeUsername)
    res.json(stats)
  } catch (error) {
    next(error)
  }
}

const getDetailedGitHubStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user || !user.githubUsername) {
      res.status(404)
      throw new Error('GitHub profile not configured')
    }

    const results = {
      summary: null,
      history: [],
      yearly: {},
      repos: [],
      languages: [],
      activity: [],
    }


    try {
      results.summary = await getGitHubSummary(user.githubUsername)
      results.history = await getGitHubActivityHistory(user.githubUsername, results.summary.events)
    } catch (e) {
      console.error('Summary/History fetch error:', e.message)
    }

 
    try {
      results.yearly = await getGitHubYearlyStats(user.githubUsername)
    } catch (e) {
      console.error('Yearly fetch error:', e.message)
    }


    try {
      results.repos = await getGitHubTopRepos(user.githubUsername)
    } catch (e) {
      console.error('Top repos fetch error:', e.message)
    }

  
    try {
      results.languages = await getGitHubLanguageStats(user.githubUsername)
    } catch (e) {
      console.error('Languages fetch error:', e.message)
    }


    try {
      results.activity = await getGitHubRecentActivity(user.githubUsername, results.summary?.events)
    } catch (e) {
      console.error('Recent activity fetch error:', e.message)
    }

    res.json(results)
  } catch (error) {
    next(error)
  }
}


module.exports = {
  getOverview,
  getGitHubStats,
  getLeetCodeStats,
  getDetailedGitHubStats,
}

