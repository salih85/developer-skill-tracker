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

  const getHeatmapLevel = (count) => {
    if (count === 0) return 0
    if (count < 2) return 1
    if (count < 4) return 2
    if (count < 8) return 3
    return 4
  }

  // Calculate some extra profile stats
  const totalCommits = data?.summary?.commits || 0
  const joinDate = data?.summary?.created_at ? new Date(data.summary.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="GitHub Performance Insights">
      {loading && (
        <div className="modal-loading-overlay">
          <div className="spinner"></div>
          <p>Analyzing contribution patterns...</p>
        </div>
      )}
      {error && <div className="modal-error-message">⚠️ {error}</div>}
      
      {data && (
        <div className="gh-premium-modal">
          {/* Header Section */}
          <div className="gh-header-card">
            <div className="gh-header-main">
              <img src={data.summary.avatar} alt={data.summary.username} className="gh-premium-avatar" />
              <div className="gh-header-text">
                <h1>{data.summary.name}</h1>
                <p className="gh-handle">@{data.summary.username}</p>
                {data.summary.bio && <p className="gh-premium-bio">{data.summary.bio}</p>}
                <div className="gh-meta-tags">
                  {data.summary.location && <span>📍 {data.summary.location}</span>}
                  {data.summary.company && <span>🏢 {data.summary.company}</span>}
                  <span>📅 Joined {joinDate}</span>
                </div>
              </div>
            </div>
            <div className="gh-header-stats">
              <div className="mini-stat">
                <span className="value">{formatNumber(totalCommits)}</span>
                <span className="label">Total Commits</span>
              </div>
              <div className="mini-stat">
                <span className="value">{formatNumber(data.summary.followers)}</span>
                <span className="label">Followers</span>
              </div>
            </div>
          </div>

          <div className="gh-grid-layout">
            {/* Left Column: Stats & Languages */}
            <div className="gh-col-left">
              <div className="gh-card-section">
                <h3>Global Influence</h3>
                <div className="gh-influence-grid">
                  <div className="influence-item">
                    <span className="icon">📂</span>
                    <div>
                      <small>Repositories</small>
                      <strong>{data.summary.repos}</strong>
                    </div>
                  </div>
                  <div className="influence-item">
                    <span className="icon">⭐</span>
                    <div>
                      <small>Total Stars</small>
                      <strong>{data.repos.reduce((acc, r) => acc + r.stars, 0)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="gh-card-section">
                <h3>Language Mastery</h3>
                <div className="gh-languages">
                  {data.languages.map((lang, idx) => (
                    <div key={idx} className="lang-row">
                      <div className="lang-info">
                        <span className="lang-name">{lang.name}</span>
                        <span className="lang-count">{lang.count} repos</span>
                      </div>
                      <div className="lang-bar-bg">
                        <div 
                          className="lang-bar-fill" 
                          style={{ 
                            width: `${(lang.count / data.summary.repos) * 100}%`,
                            background: `var(--accent-color, #6366f1)` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="gh-card-section">
                <h3>Yearly Activity</h3>
                <div className="gh-yearly-row">
                  {Object.entries(data.yearly).sort((a,b) => b[0] - a[0]).map(([year, count]) => (
                    <div key={year} className="yearly-stat">
                      <span className="year">{year}</span>
                      <span className="count">{formatNumber(count)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Heatmap & Activity */}
            <div className="gh-col-right">
              <div className="gh-card-section">
                <h3>Activity Trends (30 Days)</h3>
                <div className="gh-heatmap-container">
                  <div className="gh-heatmap-grid">
                    {data.history.map((day, idx) => (
                      <div 
                        key={idx} 
                        className={`gh-heat-box level-${getHeatmapLevel(day.count)}`}
                        title={`${day.count} commits on ${day.date}`}
                      />
                    ))}
                  </div>
                  <div className="heatmap-legend">
                    <span>Less</span>
                    <div className="gh-heat-box level-0" />
                    <div className="gh-heat-box level-1" />
                    <div className="gh-heat-box level-2" />
                    <div className="gh-heat-box level-3" />
                    <div className="gh-heat-box level-4" />
                    <span>More</span>
                  </div>
                </div>
              </div>

              <div className="gh-card-section">
                <h3>Recent Pulse</h3>
                <div className="gh-activity-list">
                  {data.activity.length === 0 ? (
                    <p className="empty-activity">No recent public events found.</p>
                  ) : (
                    data.activity.map((act, idx) => (
                      <div key={idx} className="activity-item">
                        <div className="act-icon">{act.type === 'PushEvent' ? '🚀' : '🔧'}</div>
                        <div className="act-details">
                          <p>{act.description}</p>
                          <small>{new Date(act.date).toLocaleDateString()} at {new Date(act.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="gh-section-title-premium">
            <span>Featured Projects</span>
          </div>
          <div className="gh-premium-repos">
            {data.repos.map((repo, idx) => (
              <a key={idx} href={repo.url} target="_blank" rel="noopener noreferrer" className="gh-premium-repo-card">
                <div className="repo-header">
                  <h4>{repo.name}</h4>
                  <span className="repo-stars">⭐ {repo.stars}</span>
                </div>
                {repo.description && <p className="repo-desc">{repo.description}</p>}
                <div className="repo-footer">
                  {repo.language && <span className="repo-lang">● {repo.language}</span>}
                  <span className="repo-updated">Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
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
