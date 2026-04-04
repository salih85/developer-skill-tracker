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
  if (error) return null // Hide if error or not connected 

  if (!data) return null

  const getHeatmapLevel = (count) => {
    if (count === 0) return 0
    if (count < 2) return 1
    if (count < 4) return 2
    if (count < 8) return 3
    return 4
  }

  const totalCommits = data?.summary?.commits || 0

  return (
    <section className="github-stats-bottom" ref={sectionRef}>
      <div className="section-header">
        <h3>GitHub Engine Insights</h3>
        <p>Detailed performance metrics and contribution patterns.</p>
      </div>

      <div className="gh-premium-modal" style={{ background: 'transparent', padding: 0, boxShadow: 'none' }}>
        <div className="gh-header-card" style={{ marginBottom: '2rem' }}>
          <div className="gh-header-main">
            <img src={data.summary.avatar} alt={data.summary.username} className="gh-premium-avatar" />
            <div className="gh-header-text">
              <h1>{data.summary.name}</h1>
              <p className="gh-handle">@{data.summary.username}</p>
              <div className="gh-meta-tags">
                <span>📂 {data.summary.repos} Repos</span>
                <span>⭐ {data.repos.reduce((acc, r) => acc + r.stars, 0)} Stars</span>
              </div>
            </div>
          </div>
          <div className="gh-header-stats">
            <div className="mini-stat">
              <span className="value">{formatNumber(totalCommits)}</span>
              <span className="label">Total Commits</span>
            </div>
          </div>
        </div>

        <div className="gh-grid-layout">
          <div className="gh-col-left">
            <div className="gh-card-section">
              <h3>Language Mastery</h3>
              <div className="gh-languages">
                {data.languages.slice(0, 5).map((lang, idx) => (
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
                          background: `var(--accent-primary)` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
                </div>
              </div>
          </div>
        </div>

        <div className="gh-section-title-premium" style={{ marginTop: '2rem' }}>
          <span>Top Repositories</span>
        </div>
        <div className="gh-premium-repos" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {data.repos.slice(0, 4).map((repo, idx) => (
            <a key={idx} href={repo.url} target="_blank" rel="noopener noreferrer" className="gh-premium-repo-card">
              <div className="repo-header">
                <h4>{repo.name}</h4>
                <span className="repo-stars">⭐ {repo.stars}</span>
              </div>
              <p className="repo-desc" style={{ fontSize: '0.8rem' }}>{repo.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GitHubStatsSection
