const Journal = require('../models/Journal')

// @desc    Get all user journal entries
// @route   GET /api/journals
// @access  Private
const getJournals = async (req, res, next) => {
  try {
    const journals = await Journal.find({ user: req.user.id }).sort({ date: -1 })
    res.json(journals)
  } catch (error) {
    next(error)
  }
}

// @desc    Create a new journal entry
// @route   POST /api/journals
// @access  Private
const createJournal = async (req, res, next) => {
  try {
    const { content, date } = req.body
    if (!content) {
      res.status(400)
      throw new Error('Journal content is required')
    }

    const journal = await Journal.create({
      user: req.user.id,
      content,
      date: date || undefined,
    })

    res.status(201).json(journal)
  } catch (error) {
    next(error)
  }
}

// @desc    Delete a journal entry
// @route   DELETE /api/journals/:id
// @access  Private
const deleteJournal = async (req, res, next) => {
  try {
    const journal = await Journal.findOne({ _id: req.params.id, user: req.user.id })
    if (!journal) {
      res.status(404)
      throw new Error('Journal entry not found')
    }

    await journal.deleteOne()
    res.json({ message: 'Journal entry removed' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getJournals,
  createJournal,
  deleteJournal,
}
