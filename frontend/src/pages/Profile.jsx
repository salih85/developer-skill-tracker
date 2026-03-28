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
      setMessage('Profile updated successfully')
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
      setMessage('Goal added successfully')
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
        <section className="profile-page">
          <div className="profile-card">
            <h2>Account & sync</h2>
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <label>
                Name
                <input name="name" value={profile.name || ''} onChange={handleProfileChange} />
              </label>
              <label>
                GitHub username
                <input
                  name="githubUsername"
                  value={profile.githubUsername || ''}
                  onChange={handleProfileChange}
                />
              </label>
              <label>
                LeetCode username
                <input
                  name="leetcodeUsername"
                  value={profile.leetcodeUsername || ''}
                  onChange={handleProfileChange}
                />
              </label>
              <button className="primary-button" type="submit">
                Save account settings
              </button>
            </form>
          </div>

          <div className="goal-editor">
            <h2>Goal manager</h2>
            <form onSubmit={handleAddGoal} className="goal-form">
              <label>
                Goal title
                <input name="title" value={goalForm.title} onChange={handleGoalChange} />
              </label>
              <label>
                Target
                <input name="target" value={goalForm.target} onChange={handleGoalChange} />
              </label>
              <label>
                Due date
                <input
                  name="dueDate"
                  type="date"
                  value={goalForm.dueDate}
                  onChange={handleGoalChange}
                />
              </label>
              <button className="primary-button" type="submit">
                Add goal
              </button>
            </form>
          </div>

          {message && <div className="info-message">{message}</div>}
          {error && <div className="form-error">{error}</div>}

          <div className="goal-list-full">
            <h3>Goals</h3>
            {goals.length === 0 ? (
              <p>No goals yet. Create one to measure weekly progress.</p>
            ) : (
              goals.map((goal) => (
                <div key={goal._id} className="goal-row">
                  <div>
                    <strong>{goal.title}</strong>
                    <p>{goal.target}</p>
                    {goal.dueDate && <small>Due {formatDate(goal.dueDate)}</small>}
                  </div>
                  <div className="goal-actions">
                    <button
                      type="button"
                      onClick={() => handleGoalUpdate(goal, { completed: !goal.completed })}
                    >
                      {goal.completed ? 'Mark open' : 'Complete'}
                    </button>
                    <button type="button" onClick={() => handleGoalDelete(goal._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Profile
