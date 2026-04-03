const express = require('express')
const { getQuests, updateQuest } = require('../controllers/questController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(protect)

router.get('/', getQuests)
router.put('/:id', updateQuest)

module.exports = router
