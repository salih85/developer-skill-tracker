import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Navbar = () => {
  const { logout, user } = useAuth()

  return (
    <nav className="navbar">
      <div className="brand">SKILL_TRACKER // v2.0</div>
      
      <div className="nav-links">
        <Link to="/">Terminal</Link>
        <Link to="/profile">Identity</Link>
        <div className="user-chip">{user?.name || 'Developer'}</div>
        <button className="logout-button" onClick={logout}>
          DISCONNECT
        </button>
      </div>
    </nav>
  )
}

export default Navbar
