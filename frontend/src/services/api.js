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
export const getDetailedGitHubStats = (token) => request('/stats/github/detailed', 'GET', null, token)

// Skills
export const getSkills = (token) => request('/skills', 'GET', null, token)
export const createSkill = (token, skill) => request('/skills', 'POST', skill, token)
export const updateSkill = (token, id, skill) => request(`/skills/${id}`, 'PUT', skill, token)
export const deleteSkill = (token, id) => request(`/skills/${id}`, 'DELETE', null, token)

// Journals
export const getJournals = (token) => request('/journals', 'GET', null, token)
export const createJournal = (token, journal) => request('/journals', 'POST', journal, token)
export const deleteJournal = (token, id) => request(`/journals/${id}`, 'DELETE', null, token)

// Projects
export const getProjects = (token) => request('/projects', 'GET', null, token)
export const createProject = (token, project) => request('/projects', 'POST', project, token)
export const updateProject = (token, id, project) => request(`/projects/${id}`, 'PUT', project, token)
export const deleteProject = (token, id) => request(`/projects/${id}`, 'DELETE', null, token)

// Quests
export const getQuests = (token) => request('/quests', 'GET', null, token)
export const updateQuest = (token, id) => request(`/quests/${id}`, 'PUT', null, token)
