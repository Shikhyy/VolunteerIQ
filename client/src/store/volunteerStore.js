import { create } from 'zustand'

export const useVolunteerStore = create((set) => ({
  volunteers: [],
  myProfile: null,
  matchResults: {},

  setVolunteers: (volunteers) => set({ volunteers }),
  setMyProfile: (profile) => set({ myProfile: profile }),
  setMatchResults: (taskId, results) => set((state) => ({
    matchResults: { ...state.matchResults, [taskId]: results }
  })),
  addVolunteer: (volunteer) => set((state) => ({ 
    volunteers: [...state.volunteers, volunteer] 
  }))
}))