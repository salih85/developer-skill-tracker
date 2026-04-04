import { useEffect, useState, useRef } from 'react'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import Chart from '../components/Chart.jsx'
import SkillMatrix from '../components/SkillMatrix.jsx'
import Journal from '../components/Journal.jsx'
import AchievementBadges from '../components/AchievementBadges.jsx'
import DailyQuest from '../components/DailyQuest.jsx'
import ProjectGallery from '../components/ProjectGallery.jsx'
import Roadmap from '../components/Roadmap.jsx'
import GitHubStatsSection from '../components/GitHubStatsSection.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getOverview, getGoals, createGoal } from '../services/api.js'
import { formatNumber } from '../utils/formatData.js'

const Dashboard = () => {
  const { token, user } = useAuth()
  const [overview, setOverview] = useState(null)
  const [goals, setGoals] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Goal Center state
  const [newGoal, setNewGoal] = useState({ title: '', target: '' })
  const [isAdding, setIsAdding] = useState(false)
  
  const githubStatsRef = useRef(null)

  const scrollToGithub = () => {
    githubStatsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadData = async () => {
    try {
      const result = await getOverview(token)
      setOverview(result.overview)
      const savedGoals = await getGoals(token)
      setGoals(savedGoals)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (!token) return
    loadData()
  }, [token])

  const handleAddGoal = async (e) => {
    e.preventDefault()
    if (!newGoal.title || !newGoal.target) return
    
    setIsAdding(true)
    try {
      await createGoal(token, { ...newGoal, progress: 0 })
      setNewGoal({ title: '', target: '' })
      setSuccess('Goal added successfully!')
      loadData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsAdding(false)
    }
  }

  const github = overview?.github
  const leetcode = overview?.leetcode
  const weekly = overview?.weekly || []

  // Developer Level Calculation
  const totalCommits = github?.commits || 0
  const leetcodeSolved = leetcode?.solved || 0
  const totalPoints = (totalCommits * 2) + (leetcodeSolved * 10)
  const level = Math.floor(totalPoints / 100) + 1
  const nextLevelPoints = level * 100
  const progressToNext = (totalPoints % 100)

  const getRankTitle = (lvl) => {
    if (lvl < 5) return 'Junior Dev'
    if (lvl < 10) return 'Solid Contributor'
    if (lvl < 20) return 'Senior Architect'
    return 'Fullstack Legend'
  }

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-panel">
        <Navbar />
        
        <header className="dash-premium-header">
          <div className="header-left">
            <h1>Engine Room</h1>
            <p>Welcome back, <strong>{user?.name || 'Developer'}</strong>. Your systems are nominal.</p>
          </div>
          <div className="header-level-card">
            <div className="level-info">
              <span className="level-num">Lvl {level}</span>
              <span className="level-title">{getRankTitle(level)}</span>
            </div>
            <div className="level-progress-bar">
              <div className="level-fill" style={{ width: `${progressToNext}%` }}></div>
            </div>
            <small>{nextLevelPoints - (totalPoints % 100)} pts to next level</small>
          </div>
        </header>

        {error && <div className="page-error">{error}</div>}
        {success && <div className="info-message">{success}</div>}

        <section className="metric-grid">
          <div className="metric-card clickable gh-card-premium" onClick={scrollToGithub}>
            <div className="card-icon">🚀</div>
            <h3>GitHub Activity</h3>
            <p>{formatNumber(totalCommits)}</p>
            <div className="card-footer">
              <span>{github?.username || 'No GitHub connected'}</span>
              <small>View Insights →</small>
            </div>
          </div>
          <div className="metric-card">
            <div className="card-icon">🧩</div>
            <h3>LeetCode fixed</h3>
            <p>{formatNumber(leetcodeSolved)}</p>
            <span>{leetcode?.username || 'No LeetCode connected'}</span>
          </div>
          <div className="metric-card">
            <div className="card-icon">🏆</div>
            <h3>Global Rank</h3>
            <p>#{formatNumber(leetcode?.ranking || 0)}</p>
            <span>Current percentile</span>
          </div>
          <div className="metric-card">
            <div className="card-icon">🎯</div>
            <h3>Success Rate</h3>
            <p>{Math.round((goals.filter((g) => g.completed).length / (goals.length || 1)) * 100)}%</p>
            <span>Goal completion rate</span>
          </div>
        </section>

        <div className="dashboard-main-grid">
          <div className="main-grid-left">
            <section className="chart-section-premium">
              <div className="section-header">
                <h3>Velocity History</h3>
                <span>Last 7 Days</span>
              </div>
              <Chart data={weekly} />
            </section>

            <Roadmap level={level} />

            <ProjectGallery token={token} />
            
            <section className="goal-center-card">
              <div className="section-header">
                <h3>Goal Center</h3>
                <p>Add a new milestone for this week.</p>
              </div>
              <form onSubmit={handleAddGoal} className="quick-goal-form">
                <div className="quick-goal-row">
                  <input 
                    type="text" 
                    placeholder="What's the goal? (e.g., Master Tailwind)" 
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Target (e.g., Build 3 projects)" 
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" disabled={isAdding} className="dash-save-btn">
                  {isAdding ? 'Saving...' : 'Direct Save'}
                </button>
              </form>
            </section>
          </div>

          <div className="main-grid-right">
            <DailyQuest token={token} />

            <section className="goal-preview-premium">
              <div className="section-header">
                <h3>Live Progress</h3>
              </div>
              <div className="goal-list-mini">
                {goals.length === 0 ? (
                  <p className="empty-state">No goals in progress. Set one above!</p>
                ) : (
                  goals.filter(g => !g.completed).slice(0, 4).map((goal) => (
                    <div key={goal._id} className="goal-mini-card">
                      <div className="goal-mini-info">
                        <h4>{goal.title}</h4>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="goal-mini-bar">
                        <div className="goal-mini-fill" style={{ width: `${goal.progress}%` }}></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <Journal token={token} />
            
            <AchievementBadges points={totalPoints} />

            <SkillMatrix token={token} />
          </div>
        </div>

        <GitHubStatsSection token={token} sectionRef={githubStatsRef} />
      </div>
    </div>
  )
}

export default Dashboard

