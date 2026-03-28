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

    if (user.githubUsername) {
      overview.github = await getGitHubSummary(user.githubUsername)
      overview.weekly = await getGitHubWeeklyProgress(user.githubUsername)
    }

    if (user.leetcodeUsername) {
      overview.leetcode = await getLeetCodeSummary(user.leetcodeUsername)
    }

    await Stats.findOneAndUpdate(
      { user: req.user.id },
      {
        githubCommits: overview.github?.commits || 0,
        leetcodeSolved: overview.leetcode?.solved || 0,
        weeklyProgress: overview.weekly,
      },
      { new: true, upsert: true }
    )

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
