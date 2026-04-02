import React, { useState, useEffect } from 'react'
import { getJournals, createJournal, deleteJournal } from '../services/api'

const Journal = ({ token }) => {
  const [journals, setJournals] = useState([])
  const [content, setContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchJournals = async () => {
    try {
      const data = await getJournals(token)
      setJournals(data.slice(0, 5)) // Only show last 5
    } catch (err) {
      setError('Failed to fetch journals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJournals()
  }, [token])

  const handlePost = async (e) => {
    e.preventDefault()
    if (!content) return
    setIsPosting(true)
    try {
      await createJournal(token, { content })
      setContent('')
      fetchJournals()
    } catch (err) {
      setError('Failed to post journal')
    } finally {
      setIsPosting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteJournal(token, id)
      fetchJournals()
    } catch (err) {
      setError('Failed to delete entry')
    }
  }

  return (
    <section className="goal-preview-premium">
      <div className="section-header">
        <h3>Daily Journal</h3>
        <p>Log your daily wins and learnings.</p>
      </div>

      <form onSubmit={handlePost} className="quick-goal-form" style={{ marginBottom: '20px' }}>
        <textarea
          placeholder="What did you learn today?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ 
            width: '100%', 
            padding: '14px', 
            borderRadius: '14px', 
            border: '1px solid #e2e8f0', 
            background: '#f8fafc',
            resize: 'none',
            minHeight: '80px',
            fontFamily: 'inherit'
          }}
        />
        <button type="submit" disabled={isPosting} className="dash-save-btn">
          {isPosting ? 'Posting...' : 'Log Activity'}
        </button>
      </form>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="activity-list">
          {journals.length === 0 ? (
            <p className="empty-state">No entries yet. Start logging!</p>
          ) : (
            journals.map((entry) => (
              <div key={entry._id} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content" style={{ flex: 1 }}>
                  <p style={{ color: '#1e293b', fontWeight: 500, fontSize: '0.9rem' }}>{entry.content}</p>
                  <p>{new Date(entry.date).toLocaleDateString()} • {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <button 
                  onClick={() => handleDelete(entry._id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.3 }}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  )
}

export default Journal
