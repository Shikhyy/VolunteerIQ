import { create } from 'zustand'
import apiClient from '../api/client'

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'

const mockUser = {
  uid: 'dev-user-001',
  email: 'demo@volunteeriq.org',
  displayName: 'Demo User',
  photoURL: null,
}

export const useAuthStore = create((set, get) => ({
  user: DEV_MODE ? mockUser : null,
  role: DEV_MODE ? 'volunteer' : null,
  loading: false,
  devMode: DEV_MODE,

  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),

  login: async (email, password) => {
    if (DEV_MODE) {
      localStorage.setItem('authToken', 'dev-token')
      set({ user: mockUser, role: 'volunteer' })
      return mockUser
    }
    try {
      const { data } = await apiClient.auth.login({ email, password })
      localStorage.setItem('authToken', data.token)
      set({ user: data.user, role: data.user.role })
      return data.user
    } catch (error) {
      throw error
    }
  },

  signup: async (email, password, name) => {
    if (DEV_MODE) {
      localStorage.setItem('authToken', 'dev-token')
      set({ user: { ...mockUser, displayName: name, email }, role: 'volunteer' })
      return { user: mockUser, name }
    }
    try {
      const { data } = await apiClient.auth.register({ email, password, name })
      localStorage.setItem('authToken', data.token)
      set({ user: data.user, role: data.user.role })
      return { user: data.user, name }
    } catch (error) {
      throw error
    }
  },

  loginWithGoogle: async () => {
    if (DEV_MODE) {
      localStorage.setItem('authToken', 'dev-token')
      set({ user: mockUser, role: 'volunteer' })
      return mockUser
    }
    try {
      const { data } = await apiClient.post('/api/auth/google')
      localStorage.setItem('authToken', data.token)
      set({ user: data.user, role: data.user.role })
      return data.user
    } catch (error) {
      throw error
    }
  },

  logout: async () => {
    if (!DEV_MODE) {
      try {
        await apiClient.auth.logout()
      } catch (e) {
      }
    }
    localStorage.removeItem('authToken')
    set({ user: null, role: null })
  },

  initAuth: () => {
    if (DEV_MODE) {
      set({ user: mockUser, role: 'volunteer', loading: false })
      return () => {}
    }
    const token = localStorage.getItem('authToken')
    if (token) {
      apiClient.auth.me()
        .then(({ data }) => {
          set({ user: data.user, role: data.user.role, loading: false })
        })
        .catch(() => {
          localStorage.removeItem('authToken')
          set({ user: null, role: null, loading: false })
        })
    }
  },
}))