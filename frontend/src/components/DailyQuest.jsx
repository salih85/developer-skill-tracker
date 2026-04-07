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
    <section className="daily-quest-premium glass-panel">
      <div className="section-header">
        <div className="header-icon">⚡</div>
        <div className="header-text">
          <h3>Daily Quests</h3>
          <p>Complete these tasks to accelerate your growth.</p>
        </div>
        <span className="xp-total">+{quests.reduce((acc, q) => q.completed ? acc + q.points : acc, 0)} XP Earned</span>
      </div>
      <div className="quest-grid-mini">
        {quests.map((quest) => (
          <div key={quest._id} className={`quest-mini-card ${quest.completed ? 'is-completed' : ''}`} onClick={() => handleToggle(quest._id)}>
            <div className="quest-header-mini">
              <span className="quest-status-bullet"></span>
              <h4>{quest.title}</h4>
              <span className="xp-tag">+{quest.points} XP</span>
            </div>
            <p className="quest-desc-mini">{quest.description}</p>
            <div className="quest-progress-mini">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: quest.completed ? '100%' : '0%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default DailyQuest
