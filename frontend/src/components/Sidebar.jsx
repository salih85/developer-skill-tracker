import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Sidebar = () => {
  const { user } = useAuth()
  const location = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">ANTIGRAVITY</div>
      
      <div className="sidebar-summary">
        <p>Telemetry Node</p>
        <h3>{user?.name || 'Developer'}</h3>
        <small>{user?.email}</small>
      </div>

      <div className="sidebar-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          <span>❖</span> Overview
        </Link>
        <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
          <span>⌬</span> Goal Center
        </Link>
        <Link to="/projects" className={location.pathname === '/projects' ? 'active' : ''}>
          <span>⌘</span> Projects
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar
