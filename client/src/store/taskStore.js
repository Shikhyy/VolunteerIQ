import { create } from 'zustand'
import { tasks as tasksApi } from '../api/client'

export const useTaskStore = create((set, get) => ({
  tasks: [],
  myTasks: [],
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
  
  fetchTasks: async () => {
    set({ loading: true })
    try {
      const { data } = await tasksApi.list()
      set({ tasks: data || [], loading: false })
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      set({ loading: false })
    }
  },
  
  fetchMyTasks: async () => {
    try {
      const { data } = await tasksApi.list({ myTasks: true })
      set({ myTasks: data || [] })
    } catch (error) {
      console.error('Failed to fetch my tasks:', error)
    }
  },
  
  addTask: async (task) => {
    try {
      const { data } = await tasksApi.create(task)
      set((state) => ({ tasks: [...state.tasks, data] }))
      return data
    } catch (error) {
      console.error('Failed to create task:', error)
      throw error
    }
  },
  
  updateTask: async (taskId, updates) => {
    try {
      const { data } = await tasksApi.update(taskId, updates)
      set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? { ...t, ...data } : t)
      }))
      return data
    } catch (error) {
      console.error('Failed to update task:', error)
      throw error
    }
  },

  deleteTask: async (taskId) => {
    try {
      await tasksApi.delete(taskId)
      set((state) => ({
        tasks: state.tasks.filter(t => t.id !== taskId)
      }))
    } catch (error) {
      console.error('Failed to delete task:', error)
      throw error
    }
  },

  getFilteredTasks: () => {
    const { tasks, filters } = get()
    return tasks.filter(task => {
      if (filters.category && task.category !== filters.category) return false
      if (filters.urgency && task.urgency !== parseInt(filters.urgency)) return false
      if (filters.status && task.status !== filters.status) return false
      return true
    })
  }
}))
