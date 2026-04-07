const Chart = ({ data }) => {
  if (!data?.length) {
    return <div className="chart-empty">No weekly progress yet</div>
  }

  const counts = data.map((item) => item.count)
  const totalCommits = counts.reduce((a, b) => a + b, 0)
  const maxCount = Math.max(...counts, 1)

  return (
    <div className="chart-card glass-panel">
      <div className="chart-header">
        <div className="header-info">
          <h3>Weekly Velocity</h3>
          <span className="total-badge">{totalCommits} Total Commits</span>
        </div>
        {totalCommits === 0 && <small className="empty-hint">No commits detected this week</small>}
      </div>
      <div className="chart-grid">
        {data.map((item) => (
          <div key={item.key || item.date} className="chart-bar-item">
            <div className="bar-wrapper">
              <div
                className={`chart-bar ${item.count === 0 ? 'chart-bar-zero' : ''}`}
                style={{ 
                  height: `${(item.count / maxCount) * 100}%`,
                  background: item.count > 0 ? 'var(--grad-premium)' : 'rgba(255,255,255,0.05)'
                }}
              >
                {item.count > 0 && <span className="bar-value">{item.count}</span>}
              </div>
            </div>
            <span className="bar-label">{item.date.split(',')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}


export default Chart
