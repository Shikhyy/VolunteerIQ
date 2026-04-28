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

export const tasks = {
  getAll: () => apiClient.get('/api/tasks'),
  getById: (id) => apiClient.get(`/api/tasks/${id}`),
  create: (data) => apiClient.post('/api/tasks', data),
  update: (id, data) => apiClient.put(`/api/tasks/${id}`, data),
  delete: (id) => apiClient.delete(`/api/tasks/${id}`),
  match: (id) => apiClient.post(`/api/tasks/${id}/match`),
}

export const volunteers = {
  getAll: () => apiClient.get('/api/volunteers'),
  getById: (id) => apiClient.get(`/api/volunteers/${id}`),
  update: (id, data) => apiClient.put(`/api/volunteers/${id}`, data),
}

export const notifications = {
  getAll: () => apiClient.get('/api/notifications'),
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