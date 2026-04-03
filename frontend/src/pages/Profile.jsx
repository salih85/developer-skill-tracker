import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getProfile, updateProfile, getGoals, createGoal, updateGoal, deleteGoal } from '../services/api.js'
import { formatDate } from '../utils/formatData.js'

const Profile = () => {
  const { token, user, setUser } = useAuth()
  const [profile, setProfile] = useState({})
  const [goals, setGoals] = useState([])
  const [goalForm, setGoalForm] = useState({ title: '', target: '', dueDate: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return

    const loadData = async () => {
      try {
        const profileResult = await getProfile(token)
        setProfile(profileResult)
        setUser(profileResult)
        const goalsResult = await getGoals(token)
        setGoals(goalsResult)
      } catch (err) {
        setError(err.message)
      }
    }

    loadData()
  }, [token, setUser])

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleGoalChange = (e) => {
    setGoalForm({ ...goalForm, [e.target.name]: e.target.value })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const updated = await updateProfile(token, {
        name: profile.name,
        githubUsername: profile.githubUsername,
        leetcodeUsername: profile.leetcodeUsername,
      })
      setProfile(updated)
      setUser(updated)
      setMessage('Identity updated successfully')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleAddGoal = async (e) => {
    e.preventDefault()
    if (!goalForm.title) {
      setError('Goal title is required')
      return
    }

    try {
      const created = await createGoal(token, goalForm)
      setGoals([created, ...goals])
      setGoalForm({ title: '', target: '', dueDate: '' })
      setMessage('New objective established')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleGoalUpdate = async (goal, updates) => {
    try {
      const updated = await updateGoal(token, goal._id, { ...updates, progress: goal.progress })
      setGoals(goals.map((item) => (item._id === goal._id ? updated : item)))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleGoalDelete = async (id) => {
    if (!window.confirm('Decommission this objective?')) return
    try {
      await deleteGoal(token, id)
      setGoals(goals.filter((goal) => goal._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-panel">
        <Navbar />
        
        <header className="dash-premium-header">
          <div className="header-left">
            <h1>User Identity</h1>
            <p>Configure your terminal profile and sync external nodes.</p>
          </div>
        </header>

        <section className="dashboard-main-grid">
          <div className="main-grid-left">
            <div className="goal-center-card">
              <div className="section-header">
                <h3>Core Sync</h3>
              </div>
              <form onSubmit={handleProfileSubmit} className="quick-goal-form">
                <input 
                  placeholder="Full Name" 
                  name="name" 
                  value={profile.name || ''} 
                  onChange={handleProfileChange} 
                />
                <input 
                  placeholder="GitHub Username" 
                  name="githubUsername" 
                  value={profile.githubUsername || ''} 
                  onChange={handleProfileChange} 
                />
                <input 
                  placeholder="LeetCode Username" 
                  name="leetcodeUsername" 
                  value={profile.leetcodeUsername || ''} 
                  onChange={handleProfileChange} 
                />
                <button className="dash-save-btn" type="submit">
                  Synchronize Identity
                </button>
              </form>
            </div>

            <div className="chart-section-premium">
              <div className="section-header">
                <h3>Mission Logs</h3>
              </div>
              <div className="goal-list">
                {goals.length === 0 ? (
                  <p className="empty-state">No missions active.</p>
                ) : (
                  goals.map((goal) => (
                    <div key={goal._id} className="goal-row glass-card" style={{ padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--glass-border)' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{goal.title}</h4>
                          <span style={{ fontSize: '0.9rem', color: goal.completed ? 'var(--accent-neon)' : 'var(--accent-primary)', fontWeight: 700 }}>
                            {goal.completed ? 'MISSION_COMPLETE' : 'IN_PROGRESS'}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{goal.target}</p>
                        {goal.dueDate && <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Deadline: {formatDate(goal.dueDate)}</small>}
                      </div>
                      <div className="goal-actions" style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
                        <button
                          className="glass-btn"
                          style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}
                          onClick={() => handleGoalUpdate(goal, { completed: !goal.completed })}
                        >
                          Toggle
                        </button>
                        <button 
                          className="glass-btn" 
                          style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.1)', color: '#fb7185' }}
                          onClick={() => handleGoalDelete(goal._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="main-grid-right">
            <div className="goal-preview-premium">
              <div className="section-header">
                <h3>New Objective</h3>
              </div>
              <form onSubmit={handleAddGoal} className="quick-goal-form">
                <input 
                  placeholder="Objective Title" 
                  name="title" 
                  value={goalForm.title} 
                  onChange={handleGoalChange} 
                />
                <input 
                  placeholder="Target Metric" 
                  name="target" 
                  value={goalForm.target} 
                  onChange={handleGoalChange} 
                />
                <input
                  name="dueDate"
                  type="date"
                  value={goalForm.dueDate}
                  onChange={handleGoalChange}
                  style={{ colorScheme: 'dark' }}
                />
                <button className="dash-save-btn" type="submit">
                  Establish Goal
                </button>
              </form>
            </div>
            
            {message && <div className="info-message" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>{message}</div>}
            {error && <div className="page-error" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>{error}</div>}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Profile
