import React from 'react'

const AchievementBadges = ({ points }) => {
  const achievements = [
    { name: 'Hello World', icon: '🐣', threshold: 10, desc: 'Started the journey' },
    { name: 'Consistent', icon: '🔥', threshold: 50, desc: 'Reached 50 points' },
    { name: 'Problem Solver', icon: '🧠', threshold: 100, desc: 'Reached 100 points' },
    { name: 'High Flyer', icon: '🦅', threshold: 250, desc: 'Reached 250 points' },
    { name: 'Architect', icon: '🏛️', threshold: 500, desc: 'Reached 500 points' },
    { name: 'Legendary', icon: '👑', threshold: 1000, desc: 'Reached 1000 points' },
  ]

  return (
    <section className="skill-tree-preview">
      <div className="section-header">
        <h3>Achievements</h3>
        <p>Unlocks based on your activity.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {achievements.map((ach) => (
          <div 
            key={ach.name} 
            className="achievement-card"
            style={{
              padding: '16px 12px',
              borderRadius: '16px',
              background: points >= ach.threshold ? '#f8fafc' : '#f1f5f9',
              border: points >= ach.threshold ? '1px solid #e2e8f0' : '1px solid transparent',
              textAlign: 'center',
              opacity: points >= ach.threshold ? 1 : 0.4,
              filter: points >= ach.threshold ? 'none' : 'grayscale(100%)',
              transition: 'all 0.3s'
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{ach.icon}</div>
            <h4 style={{ margin: 0, fontSize: '0.8rem', color: '#1e293b' }}>{ach.name}</h4>
            <small style={{ fontSize: '0.65rem', color: '#64748b' }}>{ach.desc}</small>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AchievementBadges
