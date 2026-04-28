import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

const toArray = (value) => (Array.isArray(value) ? value : [])

const normalizeTask = (task = {}) => {
  const location = typeof task.location === 'string'
    ? { address: task.location, city: task.city || '', district: task.region || task.district || '' }
    : {
        address: task.location?.address || task.address || '',
        city: task.location?.city || task.city || '',
        district: task.location?.district || task.district || task.region || '',
      }

  const slotsNeeded = Number(task.slotsNeeded ?? task.slots_needed ?? task.slots ?? 1)
  const slotsFilled = Number(task.slotsFilled ?? task.slots_filled ?? 0)
  const requiredSkills = toArray(task.requiredSkills ?? task.required_skills)

  return {
    ...task,
    title: task.title || 'Untitled Task',
    description: task.description || '',
    category: task.category || 'General',
    urgency: Number(task.urgency ?? 3),
    status: task.status || 'open',
    deadline: task.deadline || task.date || '',
    slotsNeeded,
    slots_needed: slotsNeeded,
    slotsFilled,
    slots_filled: slotsFilled,
    requiredSkills,
    required_skills: requiredSkills,
    location,
    city: location.city,
    district: location.district,
    region: task.region || location.district,
    createdAt: task.createdAt || task.created_at || new Date().toISOString(),
  }
}

const normalizeTasks = (data) => {
  if (Array.isArray(data)) {
    return data.map(normalizeTask)
  }
  if (data?.tasks && Array.isArray(data.tasks)) {
    return data.tasks.map(normalizeTask)
  }
  return data ? normalizeTask(data) : data
}

const normalizeVolunteer = (volunteer = {}) => {
  const skills = toArray(volunteer.skills)
  const availability = toArray(volunteer.availability)
  const tasksCompleted = Number(
    volunteer.tasksCompleted ?? volunteer.tasks_completed ?? volunteer.completedTasks ?? 0
  )
  const hoursVolunteered = Number(
    volunteer.hoursVolunteered ?? volunteer.hoursContributed ?? volunteer.hours_contributed ?? 0
  )

  return {
    ...volunteer,
    name: volunteer.name || volunteer.displayName || 'Volunteer',
    email: volunteer.email || '',
    phone: volunteer.phone || '',
    skills,
    availability,
    status: volunteer.status || 'active',
    tasksCompleted,
    tasks_completed: tasksCompleted,
    hoursVolunteered,
    hoursContributed: hoursVolunteered,
    joinedAt: volunteer.joinedAt || volunteer.joined_at || new Date().toISOString(),
  }
}

const normalizeVolunteers = (data) => {
  if (Array.isArray(data)) {
    return data.map(normalizeVolunteer)
  }
  if (data?.volunteers && Array.isArray(data.volunteers)) {
    return data.volunteers.map(normalizeVolunteer)
  }
  if (data?.user) {
    return { ...data, user: normalizeVolunteer(data.user) }
  }
  return data ? normalizeVolunteer(data) : data
}

const normalizeNotifications = (data) => {
  if (Array.isArray(data)) {
    return data
  }
  if (data?.notifications && Array.isArray(data.notifications)) {
    return data.notifications
  }
  return data
}

const withData = async (request, normalizer) => {
  const response = await request
  return { ...response, data: normalizer(response.data) }
}

export const tasks = {
  list: (params) => withData(apiClient.get('/api/tasks', { params }), normalizeTasks),
  get: (id) => withData(apiClient.get(`/api/tasks/${id}`), normalizeTasks),
  create: (data) => withData(apiClient.post('/api/tasks', data), normalizeTasks),
  update: (id, data) => withData(apiClient.put(`/api/tasks/${id}`, data), normalizeTasks),
  delete: (id) => apiClient.delete(`/api/tasks/${id}`),
  apply: (id) => withData(apiClient.post(`/api/tasks/${id}/apply`), normalizeTasks),
  match: (id) => apiClient.post(`/api/tasks/${id}/match`),
}

export const volunteers = {
  getAll: () => withData(apiClient.get('/api/volunteers'), normalizeVolunteers),
  getById: (id) => withData(apiClient.get(`/api/volunteers/${id}`), normalizeVolunteers),
  getMe: () => withData(apiClient.get('/api/volunteers/me'), normalizeVolunteers),
  update: (id, data) => withData(apiClient.put(`/api/volunteers/${id}`, data), normalizeVolunteers),
  updateMe: (data) => withData(apiClient.put('/api/volunteers/me', data), normalizeVolunteers),
}

export const notifications = {
  getAll: () => withData(apiClient.get('/api/notifications'), normalizeNotifications),
  markRead: (id) => apiClient.put(`/api/notifications/${id}/read`),
  markAllRead: () => apiClient.put('/api/notifications/read-all'),
}

export const auth = {
  login: (credentials) => apiClient.post('/api/auth/login', credentials),
  register: (data) => apiClient.post('/api/auth/register', data),
  logout: () => apiClient.post('/api/auth/logout'),
  me: () => apiClient.get('/api/auth/me'),
}

export const csv = {
  import: (formData) =>
    apiClient.post('/api/csv/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  export: () => apiClient.get('/api/csv/export', { responseType: 'blob' }),
}

export default apiClient