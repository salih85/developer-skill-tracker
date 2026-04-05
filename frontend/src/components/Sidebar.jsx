import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const location = useLocation()

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">ANTIGRAVITY</div>
          <button className="sidebar-close" onClick={onClose}>×</button>
        </div>
        
        <div className="sidebar-summary">
          <p>Telemetry Node</p>
          <h3>{user?.name || 'Developer'}</h3>
          <small>{user?.email}</small>
        </div>

        <div className="sidebar-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={onClose}>
            <span>❖</span> Overview
          </Link>
          <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''} onClick={onClose}>
            <span>⌬</span> Goal Center
          </Link>
          <Link to="/" className={location.pathname === '/projects' ? 'active' : ''} onClick={onClose}>
            <span>⌘</span> Projects
          </Link>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
