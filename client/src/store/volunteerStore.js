import { create } from 'zustand'
import { volunteers as volunteersApi } from '../api/client'

export const useVolunteerStore = create((set) => ({
  volunteers: [],
  myProfile: null,
  matchResults: {},
  loading: false,

  setVolunteers: (volunteers) => set({ volunteers }),
  setMyProfile: (profile) => set({ myProfile: profile }),
  
  setMatchResults: (taskId, results) => set((state) => ({
    matchResults: { ...state.matchResults, [taskId]: results }
  })),
  
  fetchVolunteers: async () => {
    set({ loading: true })
    try {
      const { data } = await volunteersApi.getAll()
      set({ volunteers: data || [], loading: false })
    } catch (error) {
      console.error('Failed to fetch volunteers:', error)
      set({ loading: false })
    }
  },
  
  fetchProfile: async () => {
    try {
      const { data } = await volunteersApi.getMe()
      set({ myProfile: data })
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  },
  
  updateProfile: async (updates) => {
    try {
      const { data } = await volunteersApi.updateMe(updates)
      set({ myProfile: data })
      return data
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    }
  },
}))