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
        <h1>{isRegister ? 'Create your account' : 'Sign in'}</h1>
        <p>{isRegister ? 'Track GitHub and LeetCode progress in one place.' : 'Welcome back to Skill Tracker.'}</p>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} />
            </label>
          )}

          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} />
          </label>

          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} />
          </label>

          {isRegister && (
            <>
              <label>
                GitHub username
                <input name="githubUsername" value={form.githubUsername} onChange={handleChange} />
              </label>
              <label>
                LeetCode username
                <input name="leetcodeUsername" value={form.leetcodeUsername} onChange={handleChange} />
              </label>
            </>
          )}

          {error && <div className="form-error">{error}</div>}
          <button className="primary-button" type="submit">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <button className="text-button" type="button" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  )
}

export default Login
