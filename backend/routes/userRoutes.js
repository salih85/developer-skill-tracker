const express = require('express')
const {
  getCurrentUser,
  updateProfile,
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()
router.use(protect)
router.get('/me', getCurrentUser)
router.put('/me', updateProfile)
router.get('/goals', getGoals)
router.post('/goals', createGoal)
router.put('/goals/:id', updateGoal)
router.delete('/goals/:id', deleteGoal)

module.exports = router
