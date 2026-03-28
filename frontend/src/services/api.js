const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const request = async (path, method = 'GET', body = null, token = '') => {
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

export const login = (credentials) => request('/auth/login', 'POST', credentials)
export const register = (credentials) => request('/auth/register', 'POST', credentials)
export const getProfile = (token) => request('/user/me', 'GET', null, token)
export const updateProfile = (token, updates) => request('/user/me', 'PUT', updates, token)
export const getOverview = (token) => request('/stats/overview', 'GET', null, token)
export const getGoals = (token) => request('/user/goals', 'GET', null, token)
export const createGoal = (token, goal) => request('/user/goals', 'POST', goal, token)
export const updateGoal = (token, id, goal) => request(`/user/goals/${id}`, 'PUT', goal, token)
export const deleteGoal = (token, id) => request(`/user/goals/${id}`, 'DELETE', null, token)
