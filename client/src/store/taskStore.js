import { create } from 'zustand'

export const useTaskStore = create((set) => ({
  tasks: [],
  filters: {
    category: '',
    urgency: null,
    status: '',
    region: ''
  },
  selectedTask: null,

  setTasks: (tasks) => set({ tasks }),
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  clearFilters: () => set({
    filters: { category: '', urgency: null, status: '', region: '' }
  }),
  selectTask: (task) => set({ selectedTask: task }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
  }))
}))