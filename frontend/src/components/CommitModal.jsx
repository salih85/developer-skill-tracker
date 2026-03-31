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

  const getLevel = (count) => {
    if (count === 0) return 0
    if (count < 3) return 1
    if (count < 6) return 2
    if (count < 10) return 3
    return 4
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="GitHub Profile Stats">
      {loading && <div className="modal-loader">Loading detailed stats...</div>}
      {error && <div className="modal-error">{error}</div>}
      {data && (
        <div className="github-modal-content">
          <div className="gh-profile-header">
            <img src={data.summary.avatar} alt={data.summary.username} className="gh-avatar" />
            <div className="gh-user-info">
              <h2>{data.summary.name}</h2>
              <p>@{data.summary.username}</p>
              {data.summary.bio && <p className="gh-bio">{data.summary.bio}</p>}
            </div>
          </div>

          <div className="gh-stats-row">
            <div className="gh-stat-card">
              <span className="label">Repositories</span>
              <span className="value">{formatNumber(data.summary.repos)}</span>
            </div>
            <div className="gh-stat-card">
              <span className="label">Followers</span>
              <span className="value">{formatNumber(data.summary.followers)}</span>
            </div>
            <div className="gh-stat-card">
              <span className="label">Following</span>
              <span className="value">{formatNumber(data.summary.following)}</span>
            </div>
          </div>

          <div className="gh-section-title">
            <span>Weekly Activity</span>
          </div>
          <div className="gh-heatmap">
            {data.weekly.map((day, idx) => (
              <div key={idx} className="gh-day">
                <span className="gh-day-label">{day.date}</span>
                <div 
                  className={`gh-day-box gh-level-${getLevel(day.count)}`} 
                  title={`${day.count} commits on ${day.date}`}
                />
              </div>
            ))}
          </div>

          <div className="gh-section-title">
            <span>Top Repositories</span>
          </div>
          <div className="gh-repos-grid">
            {data.repos.map((repo, idx) => (
              <a key={idx} href={repo.url} target="_blank" rel="noopener noreferrer" className="gh-repo-card">
                <h4>{repo.name}</h4>
                {repo.description && <p>{repo.description}</p>}
                <div className="gh-repo-meta">
                  {repo.language && (
                    <span>● {repo.language}</span>
                  )}
                  <span>★ {formatNumber(repo.stars)}</span>
                  <span>forks {formatNumber(repo.forks)}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}

export default CommitModal
