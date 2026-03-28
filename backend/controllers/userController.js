const User = require('../models/User')
const Goal = require('../models/Goal')

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      githubUsername: user.githubUsername,
      leetcodeUsername: user.leetcodeUsername,
    })
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    const { name, githubUsername, leetcodeUsername } = req.body
    user.name = name || user.name
    user.githubUsername = githubUsername || user.githubUsername
    user.leetcodeUsername = leetcodeUsername || user.leetcodeUsername

    const updatedUser = await user.save()
    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      githubUsername: updatedUser.githubUsername,
      leetcodeUsername: updatedUser.leetcodeUsername,
    })
  } catch (error) {
    next(error)
  }
}

const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(goals)
  } catch (error) {
    next(error)
  }
}

const createGoal = async (req, res, next) => {
  try {
    const { title, target, dueDate } = req.body
    if (!title) {
      res.status(400)
      throw new Error('Goal title is required')
    }

    const goal = await Goal.create({
      user: req.user.id,
      title,
      target,
      dueDate,
    })

    res.status(201).json(goal)
  } catch (error) {
    next(error)
  }
}

const updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id })
    if (!goal) {
      res.status(404)
      throw new Error('Goal not found')
    }

    const { title, target, progress, completed, dueDate } = req.body
    goal.title = title ?? goal.title
    goal.target = target ?? goal.target
    goal.progress = progress ?? goal.progress
    goal.completed = completed ?? goal.completed
    goal.dueDate = dueDate ?? goal.dueDate

    const updatedGoal = await goal.save()
    res.json(updatedGoal)
  } catch (error) {
    next(error)
  }
}

const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id })
    if (!goal) {
      res.status(404)
      throw new Error('Goal not found')
    }

    await goal.deleteOne()
    res.json({ message: 'Goal deleted successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCurrentUser,
  updateProfile,
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
}
