const User = require('../models/User')
const Stats = require('../models/Stats')
const { getGitHubSummary, getGitHubWeeklyProgress } = require('../services/githubService')
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

    // Use Promise.allSettled to handle partial failures
    const tasks = []

    if (user.githubUsername) {
      tasks.push(
        getGitHubSummary(user.githubUsername)
          .then(async (summary) => {
            overview.github = summary
            overview.weekly = await getGitHubWeeklyProgress(user.githubUsername, summary.events)
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

    // Update stats record if possible, but don't block if it fails
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

module.exports = {
  getOverview,
  getGitHubStats,
  getLeetCodeStats,
}
