const Chart = ({ data }) => {
  if (!data?.length) {
    return <div className="chart-empty">No weekly progress yet</div>
  }

  const counts = data.map((item) => item.count)
  const totalCommits = counts.reduce((a, b) => a + b, 0)
  const maxCount = Math.max(...counts, 1)

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Weekly progress</h3>
        {totalCommits === 0 && <small>No commits found in the last 7 days</small>}
      </div>
      <div className="chart-grid">
        {data.map((item) => (
          <div key={item.key || item.date} className="chart-bar-item">
            <div
              className={`chart-bar ${item.count === 0 ? 'chart-bar-zero' : ''}`}
              style={{ height: `${(item.count / maxCount) * 100}%` }}
              title={`${item.count} commits on ${item.date}`}
            />
            <span>{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}


export default Chart
