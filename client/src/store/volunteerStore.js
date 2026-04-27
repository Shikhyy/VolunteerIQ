import { create } from 'zustand'

const mockVolunteers = [
  {
    id: 'v1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 9876543210',
    location: { city: 'Delhi', district: 'South Delhi' },
    skills: ['Medical', 'Teaching'],
    availabilitySlots: ['Saturday', 'Sunday'],
    status: 'active',
    tasksCompleted: 12,
    reliabilityScore: 0.87,
    joinedAt: '2026-03-01',
  },
  {
    id: 'v2',
    name: 'Amit Kumar',
    email: 'amit@example.com',
    phone: '+91 9876543211',
    location: { city: 'Delhi', district: 'North Delhi' },
    skills: ['Logistics', 'Driving'],
    availabilitySlots: ['Saturday', 'Sunday', 'Monday'],
    status: 'active',
    tasksCompleted: 8,
    reliabilityScore: 0.92,
    joinedAt: '2026-03-15',
  },
  {
    id: 'v3',
    name: 'Neha Gupta',
    email: 'neha@example.com',
    phone: '+91 9876543212',
    location: { city: 'Delhi', district: 'West Delhi' },
    skills: ['Tech', 'Admin'],
    availabilitySlots: ['Weekday evenings'],
    status: 'active',
    tasksCompleted: 5,
    reliabilityScore: 0.78,
    joinedAt: '2026-03-20',
  },
  {
    id: 'v4',
    name: 'Raj Patel',
    email: 'raj@example.com',
    phone: '+91 9876543213',
    location: { city: 'Delhi', district: 'Central Delhi' },
    skills: ['Medical'],
    availabilitySlots: ['Morning'],
    status: 'active',
    tasksCompleted: 3,
    reliabilityScore: 0.95,
    joinedAt: '2026-02-15',
  },
  {
    id: 'v5',
    name: 'Sita Devi',
    email: 'sita@example.com',
    phone: '+91 9876543214',
    location: { city: 'Delhi', district: 'South West Delhi' },
    skills: ['Cooking', 'Logistics'],
    availabilitySlots: ['Daily'],
    status: 'active',
    tasksCompleted: 15,
    reliabilityScore: 0.98,
    joinedAt: '2026-01-20',
  },
]

export const useVolunteerStore = create((set) => ({
  volunteers: mockVolunteers,
  myProfile: mockVolunteers[0],
  matchResults: {
    '1': [
      { volunteerId: 'v1', name: 'Priya Sharma', matchScore: 0.94, skillOverlapPct: 90, distanceKm: 2.1, aiReasoning: 'Strong medical background, lives 2km away, available weekends.' },
      { volunteerId: 'v2', name: 'Amit Kumar', matchScore: 0.87, skillOverlapPct: 80, distanceKm: 5.5, aiReasoning: 'Logistics expert, high reliability score.' },
      { volunteerId: 'v4', name: 'Raj Patel', matchScore: 0.82, skillOverlapPct: 75, distanceKm: 3.2, aiReasoning: 'Medical training, very high reliability.' },
    ]
  },
  loading: false,

  setVolunteers: (volunteers) => set({ volunteers }),
  setMyProfile: (profile) => set({ myProfile: profile }),
  
  setMatchResults: (taskId, results) => set((state) => ({
    matchResults: { ...state.matchResults, [taskId]: results }
  })),
  
  addVolunteer: (volunteer) => set((state) => ({ 
    volunteers: [...state.volunteers, { ...volunteer, id: `v${state.volunteers.length + 1}` }] 
  })),

  updateVolunteer: (volunteerId, updates) => set((state) => ({
    volunteers: state.volunteers.map(v => v.id === volunteerId ? { ...v, ...updates } : v)
  })),
}))