import React, { useState, useEffect } from 'react'
import { getQuests, updateQuest } from '../services/api'

const DailyQuest = ({ token }) => {
  const [quests, setQuests] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchQuests = async () => {
    try {
      const data = await getQuests(token)
      setQuests(data)
    } catch (err) {
      console.error('Failed to fetch quests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuests()
  }, [token])

  const handleToggle = async (id) => {
    try {
      await updateQuest(token, id)
      fetchQuests()
    } catch (err) {
      console.error('Failed to update quest')
    }
  }

  if (loading) return <div className="spinner"></div>

  return (
    <section className="goal-preview-premium">
      <div className="section-header">
        <h3>Daily Quests</h3>
        <span>+{quests.reduce((acc, q) => q.completed ? acc + q.points : acc, 0)} XP today</span>
      </div>
      <div className="goal-list-mini">
        {quests.map((quest) => (
          <div key={quest._id} className={`goal-mini-card ${quest.completed ? 'completed' : ''}`} onClick={() => handleToggle(quest._id)} style={{ cursor: 'pointer' }}>
            <div className="goal-mini-info">
              <h4 style={{ textDecoration: quest.completed ? 'line-through' : 'none', opacity: quest.completed ? 0.5 : 1 }}>
                {quest.title}
              </h4>
              <span className="xp-badge">+{quest.points} XP</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{quest.description}</p>
            <div className="goal-mini-bar" style={{ marginTop: '8px' }}>
              <div className="goal-mini-fill" style={{ width: quest.completed ? '100%' : '0%', background: quest.completed ? 'var(--accent-neon)' : 'var(--accent-primary)' }}></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default DailyQuest
