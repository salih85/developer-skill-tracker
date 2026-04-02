const express = require('express')
const {
  getJournals,
  createJournal,
  deleteJournal,
} = require('../controllers/journalController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(protect)

router.get('/', getJournals)
router.post('/', createJournal)
router.delete('/:id', deleteJournal)

module.exports = router
