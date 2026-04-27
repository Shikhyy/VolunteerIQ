import { create } from 'zustand'

const DEV_MODE = true // Set to false in production

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
      set({ user: mockUser, role: 'volunteer' })
      return mockUser
    }
    const { auth } = await import('../services/firebase')
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  },

  signup: async (email, password, name) => {
    if (DEV_MODE) {
      set({ user: { ...mockUser, displayName: name, email }, role: 'volunteer' })
      return { user: mockUser, name }
    }
    const { auth } = await import('../services/firebase')
    const { createUserWithEmailAndPassword } = await import('firebase/auth')
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return { user: result.user, name }
  },

  loginWithGoogle: async () => {
    if (DEV_MODE) {
      set({ user: mockUser, role: 'volunteer' })
      return mockUser
    }
    const { auth } = await import('../services/firebase')
    const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth')
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result.user
  },

  logout: async () => {
    set({ user: null, role: null })
  },

  initAuth: () => {
    if (DEV_MODE) {
      set({ user: mockUser, role: 'volunteer', loading: false })
      return () => {}
    }
    return async () => {
      const { auth } = await import('../services/firebase')
      const { onAuthStateChanged } = await import('firebase/auth')
      return onAuthStateChanged(auth, (user) => {
        set({ user, loading: false })
      })
    }
  },

  setRole: (role) => set({ role }),
}))