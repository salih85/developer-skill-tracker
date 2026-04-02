const express = require('express')
const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(protect)

router.get('/', getSkills)
router.post('/', createSkill)
router.put('/:id', updateSkill)
router.delete('/:id', deleteSkill)

module.exports = router
