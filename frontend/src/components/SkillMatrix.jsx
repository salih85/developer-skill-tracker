import React, { useState, useEffect } from 'react'
import { getSkills, createSkill, updateSkill, deleteSkill } from '../services/api'

const SkillMatrix = ({ token }) => {
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner', category: 'General' })
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSkills = async () => {
    try {
      const data = await getSkills(token)
      setSkills(data)
    } catch (err) {
      setError('Failed to fetch skills')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [token])

  const handleAddSkill = async (e) => {
    e.preventDefault()
    if (!newSkill.name) return
    setIsAdding(true)
    try {
      await createSkill(token, newSkill)
      setNewSkill({ name: '', level: 'Beginner', category: 'General' })
      fetchSkills()
    } catch (err) {
      setError('Failed to add skill')
    } finally {
      setIsAdding(false)
    }
  }

  const handleUpdateLevel = async (id, level) => {
    try {
      await updateSkill(token, id, { level })
      fetchSkills()
    } catch (err) {
      setError('Failed to update skill')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this skill?')) return
    try {
      await deleteSkill(token, id)
      fetchSkills()
    } catch (err) {
      setError('Failed to delete skill')
    }
  }

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

  return (
    <section className="skill-tree-preview">
      <div className="section-header">
        <h3>Expertise Matrix</h3>
        <p>Your technical proficiency across domains.</p>
      </div>

      <form onSubmit={handleAddSkill} className="quick-goal-form" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Skill name (e.g. React)"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            required
            style={{ flex: 2 }}
          />
          <select
            value={newSkill.level}
            onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
            style={{ 
                flex: 1, 
                padding: '14px', 
                borderRadius: '14px', 
                border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-main)',
                cursor: 'pointer'
            }}
          >
            {levels.map(l => <option key={l} value={l} style={{ background: '#111', color: '#fff' }}>{l}</option>)}
          </select>
          <button type="submit" disabled={isAdding} className="dash-save-btn" style={{ padding: '0 24px' }}>
            {isAdding ? '..' : 'ADD'}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="spinner"></div>
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : (
        <div className="skill-bubbles">
          {skills.length === 0 ? (
            <p className="empty-state">No neural patterns recorded yet.</p>
          ) : (
            skills.map((skill) => (
              <div key={skill._id} className={`skill-bubble ${skill.level === 'Expert' ? 'primary' : ''}`} style={{ position: 'relative' }}>
                <span style={{ fontWeight: 700 }}>{skill.name}</span>
                <select
                  value={skill.level}
                  onChange={(e) => handleUpdateLevel(skill._id, e.target.value)}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    fontSize: '0.7rem', 
                    fontWeight: 800,
                    cursor: 'pointer',
                    color: 'inherit',
                    padding: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {levels.map(l => <option key={l} value={l} style={{ background: '#111', color: '#fff' }}>{l}</option>)}
                </select>
                <button 
                  onClick={() => handleDelete(skill._id)}
                  style={{ 
                    marginLeft: '8px',
                    border: 'none', 
                    background: 'transparent', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.3)',
                    transition: '0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#ef4444'}
                  onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.3)'}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  )
}

export default SkillMatrix
