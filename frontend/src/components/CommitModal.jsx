import React, { useEffect, useState } from 'react'
import Modal from './Modal.jsx'
import { getDetailedGitHubStats } from '../services/api.js'
import { formatNumber } from '../utils/formatData.js'

const CommitModal = ({ isOpen, onClose, token }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && token) {
      setLoading(true)
      getDetailedGitHubStats(token)
        .then((res) => {
          setData(res)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    }
  }, [isOpen, token])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="GitHub Commit Details">
      {loading && <div className="modal-loader">Loading detailed stats...</div>}
      {error && <div className="modal-error">{error}</div>}
      {data && (
        <div className="commit-details">
          <div className="stats-row">
            <div className="stat-box">
              <span className="stat-label">Total Commits (Last 100 events)</span>
              <span className="stat-value">{formatNumber(data.summary.commits)}</span>
            </div>
          </div>
          <div className="yearly-stats">
            <h3>Yearly Overview</h3>
            <div className="stats-grid">
              <div className="stat-item highlighted">
                <span className="year">2026</span>
                <span className="count">{formatNumber(data.yearly['2026'])}</span>
                <small>Commits</small>
              </div>
              <div className="stat-item">
                <span className="year">2025</span>
                <span className="count">{formatNumber(data.yearly['2025'])}</span>
                <small>Commits</small>
              </div>
            </div>
          </div>
          <div className="recent-activity">
            <h3>Recent Highlights</h3>
            <div className="activity-list">
              {data.summary.events?.slice(0, 5).map((event) => (
                <div key={event.id} className="activity-item">
                  <div className="activity-dot" />
                  <div className="activity-content">
                    <strong>{event.type}</strong> in {event.repo.name}
                    <p>{new Date(event.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default CommitModal
