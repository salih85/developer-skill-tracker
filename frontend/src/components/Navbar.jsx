import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Navbar = ({ onToggle }) => {
  const { logout, user } = useAuth()

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="mobile-toggle" onClick={onToggle}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="brand">Skill Tracker</div>
      </div>
      
      <div className="nav-links">
        <Link to="/" className="nav-item">Terminal</Link>
        <Link to="/profile" className="nav-item">Identity</Link>
        <div className="user-chip">{user?.name || 'Developer'}</div>
        <button className="logout-button" onClick={logout}>
          DISCONNECT
        </button>
      </div>
    </nav>
  )
}

export default Navbar
