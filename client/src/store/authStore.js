import { create } from 'zustand'
import { auth } from '../services/firebase'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

export const useAuthStore = create((set) => ({
  user: null,
  role: null,
  loading: true,

  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),

  login: async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  },

  signup: async (email, password, name) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return { user: result.user, name }
  },

  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result.user
  },

  logout: async () => {
    await signOut(auth)
    set({ user: null, role: null })
  },

  initAuth: () => {
    return onAuthStateChanged(auth, (user) => {
      set({ user, loading: false })
    })
  }
}))