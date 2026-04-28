const express = require('express')
const router = express.Router()
const { DEV_MODE, loadJSON, saveJSON } = require('../middleware/devMode')
const { requireAuth, requireAdmin } = require('../middleware/auth')

router.get('/', requireAuth, (req, res) => {
  let tasks = []
  try {
    tasks = DEV_MODE ? loadJSON('tasks.json') : []
  } catch (err) {
    console.error('Error loading tasks:', err.message)
  }
  
  const { category, urgency, status, search } = req.query
  
  if (category) {
    tasks = tasks.filter(t => t.category === category)
  }
  if (urgency) {
    tasks = tasks.filter(t => t.urgency === parseInt(urgency))
  }
  if (status) {
    tasks = tasks.filter(t => t.status === status)
  }
  if (search) {
    const q = search.toLowerCase()
    tasks = tasks.filter(t => 
      t.title?.toLowerCase().includes(q) || 
      t.description?.toLowerCase().includes(q)
    )
  }
  
  res.json(tasks)
})

router.get('/:id', requireAuth, (req, res) => {
  let tasks = []
  try {
    tasks = DEV_MODE ? loadJSON('tasks.json') : []
  } catch (err) {
    console.error('Error loading tasks:', err.message)
  }
  const task = tasks.find(t => t.id === req.params.id)
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }
  
  res.json(task)
})

router.post('/', requireAdmin, (req, res) => {
  let tasks = []
  try {
    tasks = DEV_MODE ? loadJSON('tasks.json') : []
  } catch (err) {
    console.error('Error loading tasks:', err.message)
    return res.status(500).json({ error: 'Failed to load tasks' })
  }
  
  const newTask = {
    id: `task-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    status: 'open',
    slotsFilled: 0
  }
  
  tasks.push(newTask)
  
  if (DEV_MODE) {
    try {
      saveJSON('tasks.json', tasks)
    } catch (err) {
      console.error('Error saving tasks:', err.message)
      return res.status(500).json({ error: 'Failed to save task' })
    }
  }
  
  res.status(201).json(newTask)
})

router.put('/:id', requireAdmin, (req, res) => {
  let tasks = []
  try {
    tasks = DEV_MODE ? loadJSON('tasks.json') : []
  } catch (err) {
    console.error('Error loading tasks:', err.message)
    return res.status(500).json({ error: 'Failed to load tasks' })
  }
  const index = tasks.findIndex(t => t.id === req.params.id)
  
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' })
  }
  
  tasks[index] = { ...tasks[index], ...req.body, updatedAt: new Date().toISOString() }
  
  if (DEV_MODE) {
    try {
      saveJSON('tasks.json', tasks)
    } catch (err) {
      console.error('Error saving tasks:', err.message)
      return res.status(500).json({ error: 'Failed to save task' })
    }
  }
  
  res.json(tasks[index])
})

router.delete('/:id', requireAdmin, (req, res) => {
  let tasks = []
  try {
    tasks = DEV_MODE ? loadJSON('tasks.json') : []
  } catch (err) {
    console.error('Error loading tasks:', err.message)
    return res.status(500).json({ error: 'Failed to load tasks' })
  }
  const index = tasks.findIndex(t => t.id === req.params.id)
  
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' })
  }
  
  const deleted = tasks.splice(index, 1)[0]
  
  if (DEV_MODE) {
    try {
      saveJSON('tasks.json', tasks)
    } catch (err) {
      console.error('Error saving tasks:', err.message)
      return res.status(500).json({ error: 'Failed to save task' })
    }
  }
  
  res.json({ message: 'Task deleted', task: deleted })
})

module.exports = router