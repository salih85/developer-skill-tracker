const Skill = require('../models/Skill')

// @desc    Get all user skills
// @route   GET /api/skills
// @access  Private
const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find({ user: req.user.id }).sort({ level: -1 })
    res.json(skills)
  } catch (error) {
    next(error)
  }
}

// @desc    Create a new skill
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res, next) => {
  try {
    const { name, level, category } = req.body
    if (!name) {
      res.status(400)
      throw new Error('Skill name is required')
    }

    const skill = await Skill.create({
      user: req.user.id,
      name,
      level: level || 'Beginner',
      category: category || 'General',
    })

    res.status(201).json(skill)
  } catch (error) {
    next(error)
  }
}

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, user: req.user.id })
    if (!skill) {
      res.status(404)
      throw new Error('Skill not found')
    }

    const { name, level, category } = req.body
    skill.name = name ?? skill.name
    skill.level = level ?? skill.level
    skill.category = category ?? skill.category

    const updatedSkill = await skill.save()
    res.json(updatedSkill)
  } catch (error) {
    next(error)
  }
}

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, user: req.user.id })
    if (!skill) {
      res.status(404)
      throw new Error('Skill not found')
    }

    await skill.deleteOne()
    res.json({ message: 'Skill removed' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
}
