import { createContext, useContext, useEffect, useState } from 'react'
import * as api from '../services/api.js'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skill-tracker-user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('skill-tracker-token') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    localStorage.setItem('skill-tracker-token', token)
    if (user) {
      localStorage.setItem('skill-tracker-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('skill-tracker-user')
    }
  }, [token, user])

  const login = async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.login(credentials)
      setUser(data.user)
      setToken(data.token)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.register(credentials)
      setUser(data.user)
      setToken(data.token)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('skill-tracker-token')
    localStorage.removeItem('skill-tracker-user')
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, register, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
