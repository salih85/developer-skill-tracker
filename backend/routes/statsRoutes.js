const express = require('express')
const { getOverview, getGitHubStats, getLeetCodeStats } = require('../controllers/statsController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()
router.use(protect)
router.get('/overview', getOverview)
router.get('/github', getGitHubStats)
router.get('/leetcode', getLeetCodeStats)

module.exports = router
