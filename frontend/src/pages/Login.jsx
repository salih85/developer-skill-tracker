import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Login = () => {
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    githubUsername: '',
    leetcodeUsername: '',
  })
  const [error, setError] = useState('')
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (isRegister) {
        await register(form)
      } else {
        await login({ email: form.email, password: form.password })
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <h1>{isRegister ? 'Begin Your Odyssey' : 'System Access'}</h1>
          <p>{isRegister ? 'Initialize your developer profile and sync your progress.' : 'Welcome back, Architect. Authenticate to proceed.'}</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <label>
              Full Name
              <input 
                name="name" 
                placeholder="e.g. John Doe"
                value={form.name} 
                onChange={handleChange} 
                required
              />
            </label>
          )}

          <label>
            Email Address
            <input 
              name="email" 
              type="email" 
              placeholder="name@company.com"
              value={form.email} 
              onChange={handleChange} 
              required
            />
          </label>

          <label>
            Access Password
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••"
              value={form.password} 
              onChange={handleChange} 
              required
            />
          </label>

          {isRegister && (
            <div className="form-row">
              <label>
                GitHub Username
                <input 
                  name="githubUsername" 
                  placeholder="octocat"
                  value={form.githubUsername} 
                  onChange={handleChange} 
                />
              </label>
              <label>
                LeetCode ID
                <input 
                  name="leetcodeUsername" 
                  placeholder="lc_user"
                  value={form.leetcodeUsername} 
                  onChange={handleChange} 
                />
              </label>
            </div>
          )}

          {error && <div className="page-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}
          
          <button className="primary-button" type="submit">
            {isRegister ? 'Initialize Profile' : 'Authenticate'}
          </button>
        </form>

        <button className="text-button" type="button" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Sign in' : "New architect? Create an account"}
        </button>
      </div>
    </div>
  )
}

export default Login
