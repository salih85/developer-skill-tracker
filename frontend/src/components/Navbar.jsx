import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Navbar = () => {
  const { logout, user } = useAuth()

  return (
    <nav className="navbar">
      <div className="brand">Skill Tracker</div>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="user-chip">{user?.name || 'Developer'}</div>
    </nav>
  )
}

export default Navbar
