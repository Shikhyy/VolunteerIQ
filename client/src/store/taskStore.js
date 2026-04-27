import { create } from 'zustand'

const mockTasks = [
  {
    id: '1',
    title: 'Medical camp setup — Okhla',
    description: 'Set up a 50-bed medical camp for flood relief. Need people with medical training and physical fitness.',
    category: 'Medical',
    urgency: 5,
    status: 'in_progress',
    location: { city: 'Delhi', district: 'South Delhi', address: 'Okhla Industrial Area' },
    deadline: '2026-04-28T18:00:00Z',
    slotsNeeded: 8,
    slotsFilled: 5,
    requiredSkills: ['Medical', 'Logistics'],
    priorityScore: 0.91,
    assignedVolunteers: ['v1', 'v2', 'v3'],
  },
  {
    id: '2',
    title: 'Food packet distribution — Rohini',
    description: 'Distribute food packets to flood-affected families in the Rohini area.',
    category: 'Logistics',
    urgency: 4,
    status: 'open',
    location: { city: 'Delhi', district: 'North Delhi', address: 'Rohini Sector 15' },
    deadline: '2026-04-29T10:00:00Z',
    slotsNeeded: 6,
    slotsFilled: 3,
    requiredSkills: ['Logistics'],
    priorityScore: 0.82,
    assignedVolunteers: [],
  },
  {
    id: '3',
    title: 'Teaching support — Dwarka',
    description: 'Help students with their studies in the community center.',
    category: 'Teaching',
    urgency: 3,
    status: 'open',
    location: { city: 'Delhi', district: 'South West Delhi', address: 'Dwarka' },
    deadline: '2026-05-01T09:00:00Z',
    slotsNeeded: 4,
    slotsFilled: 2,
    requiredSkills: ['Teaching'],
    priorityScore: 0.65,
    assignedVolunteers: [],
  },
  {
    id: '4',
    title: 'Elderly care home — Janakpuri',
    description: 'Assist with daily activities at the elderly care home.',
    category: 'Admin',
    urgency: 2,
    status: 'open',
    location: { city: 'Delhi', district: 'West Delhi', address: 'Janakpuri' },
    deadline: '2026-05-05T14:00:00Z',
    slotsNeeded: 3,
    slotsFilled: 1,
    requiredSkills: ['Admin'],
    priorityScore: 0.45,
    assignedVolunteers: [],
  },
  {
    id: '5',
    title: 'Mobile clinic — Sarojini Nagar',
    description: 'Support the mobile health clinic with registration and logistics.',
    category: 'Medical',
    urgency: 4,
    status: 'open',
    location: { city: 'Delhi', district: 'South Delhi', address: 'Sarojini Nagar' },
    deadline: '2026-04-30T08:00:00Z',
    slotsNeeded: 5,
    slotsFilled: 2,
    requiredSkills: ['Medical', 'Admin'],
    priorityScore: 0.78,
    assignedVolunteers: [],
  },
  {
    id: '6',
    title: 'Shelter construction — Narela',
    description: 'Help build temporary shelters for flood-affected families.',
    category: 'Construction',
    urgency: 5,
    status: 'open',
    location: { city: 'Delhi', district: 'North Delhi', address: 'Narela' },
    deadline: '2026-04-28T20:00:00Z',
    slotsNeeded: 10,
    slotsFilled: 4,
    requiredSkills: ['Construction', 'Logistics'],
    priorityScore: 0.95,
    assignedVolunteers: [],
  },
]

const myAssignedTasks = [
  { ...mockTasks[0], status: 'in_progress', myRole: 'volunteer' },
]

export const useTaskStore = create((set) => ({
  tasks: mockTasks,
  myTasks: myAssignedTasks,
  filters: { category: '', urgency: '', status: '', region: '' },
  loading: false,
  selectedTask: null,

  setTasks: (tasks) => set({ tasks }),
  setMyTasks: (myTasks) => set({ myTasks }),
  
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  
  clearFilters: () => set({
    filters: { category: '', urgency: '', status: '', region: '' }
  }),
  
  selectTask: (task) => set({ selectedTask: task }),
  
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, { ...task, id: String(state.tasks.length + 1) }] 
  })),
  
  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
  })),

  getFilteredTasks: () => {
    const state = useTaskStore.getState()
    return state.tasks.filter(task => {
      if (state.filters.category && task.category !== state.filters.category) return false
      if (state.filters.urgency && task.urgency !== parseInt(state.filters.urgency)) return false
      if (state.filters.status && task.status !== state.filters.status) return false
      return true
    })
  }
}))