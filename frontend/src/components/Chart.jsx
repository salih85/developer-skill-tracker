const Chart = ({ data }) => {
  if (!data?.length) {
    return <div className="chart-empty">No weekly progress yet</div>
  }

  const maxCount = Math.max(...data.map((item) => item.count), 1)

  return (
    <div className="chart-card">
      <h3>Weekly progress</h3>
      <div className="chart-grid">
        {data.map((item) => (
          <div key={item.date} className="chart-bar-item">
            <div
              className="chart-bar"
              style={{ height: `${(item.count / maxCount) * 100}%` }}
            />
            <span>{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Chart
