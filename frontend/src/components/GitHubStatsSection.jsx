import React, { useEffect, useState } from 'react'
import { getDetailedGitHubStats } from '../services/api.js'
import { formatNumber } from '../utils/formatData.js'

const GitHubStatsSection = ({ token, sectionRef }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (token) {
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
  }, [token])

  if (loading) return <div className="github-stats-bottom"><p>Loading GitHub Insights...</p></div>
  if (error) return null 

  if (!data || !data.summary) return null

  const totalCommits = data.summary.commits || 0

  const getHeatmapLevel = (count) => {
    if (count === 0) return 0
    if (count < 2) return 1
    if (count < 4) return 2
    if (count < 8) return 3
    return 4
  }

  const activityIcons = {
    PushEvent: '🚀',
    CreateEvent: '✨',
    WatchEvent: '⭐',
    ForkEvent: '🍴',
    IssuesEvent: '🐞',
    PullRequestEvent: '🔧',
    Default: '📝'
  }

  const formatActivityName = (type) => {
    return type.replace('Event', '').replace(/([A-Z])/g, ' $1').trim()
  }

  return (
    <section className="github-stats-bottom" ref={sectionRef}>
      <div className="gh-premium-container">
        <div className="section-header">
          <div className="header-badge">LIVE_DATA_STREAM</div>
          <h3>GitHub Engine Insights</h3>
          <p>Real-time performance metrics and contribution patterns.</p>
        </div>

        <div className="gh-main-layout">
          {/* Profile Header */}
          <div className="gh-profile-card">
            <div className="gh-user-info">
              <div className="avatar-wrapper">
                <img src={data.summary.avatar} alt={data.summary.username} className="gh-avatar" />
                <div className="status-dot"></div>
              </div>
              <div className="gh-user-details">
                <h2>{data.summary.name}</h2>
                <span className="gh-handle">@{data.summary.username}</span>
                <div className="gh-metrics-row">
                  <div className="gh-mini-metric">
                    <span className="m-val">{data.summary.repos}</span>
                    <span className="m-lbl">REPOS</span>
                  </div>
                  <div className="gh-mini-metric">
                    <span className="m-val">{data.repos.reduce((acc, r) => acc + r.stars, 0)}</span>
                    <span className="m-lbl">STARS</span>
                  </div>
                  <div className="gh-mini-metric">
                    <span className="m-val">{data.summary.followers}</span>
                    <span className="m-lbl">FOLLOWERS</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="gh-total-commits">
              <span className="commit-count">{formatNumber(totalCommits)}</span>
              <span className="commit-label">TOTAL COMMITS</span>
            </div>
          </div>

          <div className="gh-details-grid">
            {/* Language Mastery */}
            <div className="gh-card-glass languages-card">
              <div className="card-header">
                <span className="icon">📊</span>
                <h4>Language Mastery</h4>
              </div>
              <div className="languages-list">
                {data.languages.slice(0, 6).map((lang, idx) => (
                  <div key={idx} className="lang-item">
                    <div className="lang-info-top">
                      <span className="name">{lang.name}</span>
                      <span className="percent">{Math.round((lang.count / data.summary.repos) * 100)}%</span>
                    </div>
                    <div className="progress-track">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${(lang.count / data.summary.repos) * 100}%`,
                          background: `linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Trends */}
            <div className="gh-card-glass trends-card">
              <div className="card-header">
                <span className="icon">📈</span>
                <h4>Commit Velocity</h4>
              </div>
              <div className="heatmap-wrapper">
                <div className="heatmap-grid">
                  {data.history.map((day, idx) => (
                    <div 
                      key={idx} 
                      className={`heat-box level-${getHeatmapLevel(day.count)}`}
                      title={`${day.count} commits on ${day.date}`}
                    />
                  ))}
                </div>
                <div className="heatmap-legend">
                  <span>Less</span>
                  <div className="legend-boxes">
                    <div className="box level-0"></div>
                    <div className="box level-1"></div>
                    <div className="box level-2"></div>
                    <div className="box level-3"></div>
                    <div className="box level-4"></div>
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="gh-card-glass activity-card">
              <div className="card-header">
                <span className="icon">⚡</span>
                <h4>Recent Pulses</h4>
              </div>
              <div className="activity-feed">
                {data.activity && data.activity.length > 0 ? (
                  data.activity.slice(0, 5).map((act, idx) => (
                    <div key={idx} className="activity-item">
                      <div className="activity-icon">
                        {activityIcons[act.type] || activityIcons.Default}
                      </div>
                      <div className="activity-content">
                        <p className="act-desc">
                          <strong>{formatActivityName(act.type)}</strong> in <span>{act.repo.split('/')[1]}</span>
                        </p>
                        <span className="act-date">{new Date(act.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">No recent activity detected.</p>
                )}
              </div>
            </div>
          </div>

          {/* Top Repositories */}
          <div className="gh-repos-section">
            <h4 className="section-title-sm">FEATURED REPOSITORIES</h4>
            <div className="repos-grid">
              {data.repos.slice(0, 4).map((repo, idx) => (
                <a key={idx} href={repo.url} target="_blank" rel="noopener noreferrer" className="repo-card-premium">
                  <div className="repo-top">
                    <h5>{repo.name}</h5>
                    <span className="stars">⭐ {repo.stars}</span>
                  </div>
                  <p className="repo-desc">{repo.description || 'No description provided.'}</p>
                  <div className="repo-footer">
                    <span className="view-link">VIEW PROJECT →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GitHubStatsSection
