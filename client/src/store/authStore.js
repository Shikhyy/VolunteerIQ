import { create } from 'zustand'
import apiClient, { auth } from '../api/client'

export const useAuthStore = create((set, get) => ({
  user: null,
  role: null,
  loading: true,
  devMode: false,

  setUser: (user) => set({ user, role: user?.role || 'volunteer' }),
  setRole: (role) => set({ role }),

  login: async (email, password) => {
    try {
      const { data } = await auth.login({ email, password })
      localStorage.setItem('authToken', data.token)
      set({ user: data.user, role: data.user.role || 'volunteer' })
      return data.user
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },

  signup: async (email, password, name) => {
    try {
      const { data } = await auth.register({ email, password, name })
      localStorage.setItem('authToken', data.token)
      set({ user: data.user, role: 'volunteer' })
      return { user: data.user, name }
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    }
  },

  loginWithGoogle: async () => {
    throw new Error('Google sign-in is not configured in this workspace')
  },

  logout: async () => {
    try {
      await auth.logout()
    } catch (e) {
      // Ignore logout errors
    }
    localStorage.removeItem('authToken')
    set({ user: null, role: null })
  },

  initAuth: async () => {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const { data } = await auth.me()
        set({ user: data.user, role: data.user.role || 'volunteer', loading: false })
      } catch {
        localStorage.removeItem('authToken')
        set({ user: null, role: null, loading: false })
      }
    } else {
      set({ user: null, role: null, loading: false })
    }
  },
}))
