const { getOverview, getGitHubStats, getLeetCodeStats, getDetailedGitHubStats } = require('../controllers/statsController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()
router.use(protect)
router.get('/overview', getOverview)
router.get('/github', getGitHubStats)
router.get('/github/detailed', getDetailedGitHubStats)
router.get('/leetcode', getLeetCodeStats)

module.exports = router

