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
        <h3>Mission Logs</h3>
        <p>Record your tactical insights and daily progress.</p>
      </div>

      <form onSubmit={handlePost} className="quick-goal-form" style={{ marginBottom: '24px' }}>
        <textarea
          placeholder="ENTER_LOG_DATA..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ 
            width: '100%', 
            padding: '16px', 
            borderRadius: '16px', 
            border: '1px solid var(--glass-border)', 
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--text-main)',
            resize: 'none',
            minHeight: '100px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            outline: 'none',
            transition: '0.3s'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
        />
        <button type="submit" disabled={isPosting} className="dash-save-btn" style={{ marginTop: '12px', width: '100%' }}>
          {isPosting ? 'UPLOADING...' : 'SAVE_LOG_ENTRY'}
        </button>
      </form>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="activity-list">
          {journals.length === 0 ? (
            <p className="empty-state">No logs detected in the local database.</p>
          ) : (
            journals.map((entry) => (
              <div key={entry._id} className="activity-item glass-card" style={{ padding: '1rem', border: '1px solid var(--glass-border)', marginBottom: '10px' }}>
                <div className="activity-dot" style={{ background: 'var(--accent-neon)' }}></div>
                <div className="activity-content" style={{ flex: 1 }}>
                  <p style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{entry.content}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    {new Date(entry.date).toLocaleDateString()} // {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button 
                  onClick={() => handleDelete(entry._id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '14px' }}
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
