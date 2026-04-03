import React, { useState, useEffect } from 'react'
import { getProjects, createProject, deleteProject } from '../services/api'

const ProjectGallery = ({ token }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newProject, setNewProject] = useState({ title: '', description: '', techStack: '' })

  const fetchProjects = async () => {
    try {
      const data = await getProjects(token)
      setProjects(data)
    } catch (err) {
      console.error('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [token])

  const handleAddProject = async (e) => {
    e.preventDefault()
    setIsAdding(true)
    try {
      const payload = {
        ...newProject,
        techStack: newProject.techStack.split(',').map(s => s.trim()).filter(s => s)
      }
      await createProject(token, payload)
      setNewProject({ title: '', description: '', techStack: '' })
      fetchProjects()
    } catch (err) {
      console.error('Failed to add project')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete project?')) return
    try {
      await deleteProject(token, id)
      fetchProjects()
    } catch (err) {
      console.error('Failed to delete project')
    }
  }

  if (loading) return <div className="spinner"></div>

  return (
    <section className="chart-section-premium">
      <div className="section-header">
        <h3>Project Gallery</h3>
        <p>Showcase your latest builds.</p>
      </div>

      <form onSubmit={handleAddProject} className="quick-goal-form" style={{ marginBottom: '32px' }}>
        <input 
          placeholder="Project Title" 
          value={newProject.title} 
          onChange={e => setNewProject({...newProject, title: e.target.value})}
          required
        />
        <input 
          placeholder="Description" 
          value={newProject.description} 
          onChange={e => setNewProject({...newProject, description: e.target.value})}
          required
        />
        <input 
          placeholder="Tech Stack (comma separated)" 
          value={newProject.techStack} 
          onChange={e => setNewProject({...newProject, techStack: e.target.value})}
        />
        <button type="submit" disabled={isAdding} className="dash-save-btn">
          {isAdding ? 'Adding...' : 'Launch Project'}
        </button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {projects.length === 0 ? (
          <p className="empty-state">No projects yet. Build something amazing!</p>
        ) : (
          projects.map(project => (
            <div key={project._id} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{project.title}</h4>
                <button onClick={() => handleDelete(project._id)} style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>✕</button>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{project.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.techStack.map(tech => (
                  <span key={tech} className="skill-bubble" style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem' }}>{tech}</span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default ProjectGallery
