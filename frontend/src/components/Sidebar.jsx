import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Sidebar = () => {
  const { user } = useAuth()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Dev Skill Tracker</div>
      <div className="sidebar-summary">
        <p>Signed in as</p>
        <h3>{user?.name || 'Developer'}</h3>
        <small>{user?.email}</small>
      </div>
      <div className="sidebar-links">
        <Link to="/">Overview</Link>
        <Link to="/profile">Goal Center</Link>
      </div>
    </aside>
  )
}

export default Sidebar
