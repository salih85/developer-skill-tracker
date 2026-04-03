import React from 'react';

const Roadmap = ({ level }) => {
  const milestones = [
    { lvl: 1, title: 'Code Initiate', achievement: 'First Commit' },
    { lvl: 5, title: 'Logic Builder', achievement: '50 Problems Solved' },
    { lvl: 10, title: 'System Architect', achievement: 'First Fullstack App' },
    { lvl: 20, title: 'Tech Lead', achievement: 'Open Source Contributor' },
    { lvl: 50, title: 'Fullstack Legend', achievement: 'Master of All' },
  ];

  const nextMilestone = milestones.find(m => m.lvl > level);

  return (
    <section className="chart-section-premium">
      <div className="section-header">
        <h3>Growth Roadmap</h3>
        <p>Next major milestone: <strong>{nextMilestone ? nextMilestone.title : 'Max Level Reached'}</strong></p>
      </div>
      <div style={{ position: 'relative', padding: '20px 0' }}>
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: 0, 
          right: 0, 
          height: '4px', 
          background: 'rgba(255,255,255,0.05)', 
          zIndex: 0 
        }}></div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          position: 'relative', 
          zIndex: 1 
        }}>
          {milestones.map((m, idx) => (
            <div key={idx} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                borderRadius: '50%', 
                background: level >= m.lvl ? 'var(--accent-primary)' : '#333',
                margin: '0 auto 10px',
                boxShadow: level >= m.lvl ? '0 0 10px var(--accent-primary)' : 'none',
                border: '3px solid var(--bg-card)'
              }}></div>
              <small style={{ 
                display: 'block', 
                fontSize: '0.7rem', 
                fontWeight: 700, 
                color: level >= m.lvl ? 'var(--text-main)' : 'var(--text-muted)' 
              }}>
                Lv {m.lvl}
              </small>
              <span style={{ 
                fontSize: '0.65rem', 
                color: 'var(--text-muted)', 
                display: 'block',
                maxWidth: '60px',
                margin: '4px auto 0'
              }}>
                {m.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
