const User = require('../models/User')
const { generateToken } = require('../utils/helpers')

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, githubUsername, leetcodeUsername } = req.body

    if (!email || !password) {
      res.status(400)
      throw new Error('Email and password are required')
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400)
      throw new Error('User already exists')
    }

    const user = await User.create({
      name,
      email,
      password,
      githubUsername,
      leetcodeUsername,
    })

    if (!user) {
      res.status(400)
      throw new Error('Invalid user data')
    }

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        githubUsername: user.githubUsername,
        leetcodeUsername: user.leetcodeUsername,
      },
      token: generateToken(user._id),
    })
  } catch (error) {
    next(error)
  }
}

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400)
      throw new Error('Email and password are required')
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      res.status(401)
      throw new Error('Invalid email or password')
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        githubUsername: user.githubUsername,
        leetcodeUsername: user.leetcodeUsername,
      },
      token: generateToken(user._id),
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  registerUser,
  loginUser,
}
