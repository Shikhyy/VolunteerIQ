import { create } from 'zustand'

const mockUser = {
  uid: 'dev-user-001',
  email: 'demo@volunteeriq.org',
  displayName: 'Demo User',
  photoURL: null,
  role: 'volunteer'
}

export const useAuthStore = create((set, get) => ({
  user: mockUser,
  role: 'volunteer',
  loading: false,
  devMode: true,

  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),

  login: async (email, password) => {
    localStorage.setItem('authToken', 'dev-token')
    set({ user: mockUser, role: 'volunteer' })
    return mockUser
  },

  signup: async (email, password, name) => {
    localStorage.setItem('authToken', 'dev-token')
    const user = { ...mockUser, displayName: name, email }
    set({ user, role: 'volunteer' })
    return { user: mockUser, name }
  },

  loginWithGoogle: async () => {
    localStorage.setItem('authToken', 'dev-token')
    set({ user: mockUser, role: 'volunteer' })
    return mockUser
  },

  logout: async () => {
    localStorage.removeItem('authToken')
    set({ user: null, role: null })
  },

  initAuth: () => {
    set({ user: mockUser, role: 'volunteer', loading: false })
  },
}))
