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
      <div className="roadmap-container">
        <div className="roadmap-line"></div>
        <div className="roadmap-nodes">
          {milestones.map((m, idx) => (
            <div key={idx} className="milestone-node">
              <div className={`node-dot ${level >= m.lvl ? 'active' : ''}`}></div>
              <small className={`milestone-lvl ${level >= m.lvl ? 'active' : ''}`}>
                Lv {m.lvl}
              </small>
              <span className="milestone-title">
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
