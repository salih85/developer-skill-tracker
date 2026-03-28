import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import Chart from '../components/Chart.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getOverview, getGoals } from '../services/api.js'
import { formatNumber } from '../utils/formatData.js'

const Dashboard = () => {
  const { token, user } = useAuth()
  const [overview, setOverview] = useState(null)
  const [goals, setGoals] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return

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

    loadData()
  }, [token])

  const github = overview?.github
  const leetcode = overview?.leetcode
  const weekly = overview?.weekly || []

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-panel">
        <Navbar />
        <section className="dashboard-hero">
          <div>
            <h1>Welcome back, {user?.name || 'Developer'}.</h1>
            <p>Sync your GitHub and LeetCode stats, review weekly progress, and stay on track with your goals.</p>
          </div>
        </section>

        {error && <div className="page-error">{error}</div>}

        <section className="metric-grid">
          <div className="metric-card">
            <h3>GitHub commits</h3>
            <p>{formatNumber(github?.commits || 0)}</p>
            <span>{github?.username || 'No GitHub connected'}</span>
          </div>
          <div className="metric-card">
            <h3>LeetCode solved</h3>
            <p>{formatNumber(leetcode?.solved || 0)}</p>
            <span>{leetcode?.username || 'No LeetCode connected'}</span>
          </div>
          <div className="metric-card">
            <h3>Career rank</h3>
            <p>{formatNumber(leetcode?.ranking || 0)}</p>
            <span>{leetcode ? 'LeetCode rank' : 'Connect LeetCode'}</span>
          </div>
          <div className="metric-card">
            <h3>Active goals</h3>
            <p>{goals.filter((goal) => !goal.completed).length}</p>
            <span>Set a new goal on your profile</span>
          </div>
        </section>

        <section className="chart-section">
          <Chart data={weekly} />
        </section>

        <section className="goal-preview">
          <div className="goals-header">
            <h2>Goal progress</h2>
            <p>Track what matters most this week.</p>
          </div>
          <div className="goal-list">
            {goals.length === 0 ? (
              <p>No goals yet. Add your first goal in Profile.</p>
            ) : (
              goals.slice(0, 3).map((goal) => (
                <div key={goal._id} className="goal-card">
                  <div>
                    <h4>{goal.title}</h4>
                    <small>{goal.target}</small>
                  </div>
                  <span>{goal.progress}%</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
