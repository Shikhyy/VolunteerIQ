const express = require('express')
const router = express.Router()
const { DEV_MODE, loadJSON, saveJSON } = require('../middleware/devMode')
const { requireAuth, requireAdmin } = require('../middleware/auth')
const { supabase, isConfigured } = require('../services/supabase')

router.get('/', requireAuth, async (req, res) => {
  let tasks = []
  
  console.log('DEV_MODE:', DEV_MODE)
  console.log('isConfigured:', isConfigured)
  
  try {
    if (DEV_MODE || !isConfigured) {
      tasks = loadJSON('tasks.json')
    } else {
      console.log('Querying Supabase...')
      const { data, error } = await supabase.from('tasks').select('*')
      console.log('Supabase response:', { data, error })
      if (error) {
        console.error('Supabase error:', error.message)
        return res.status(500).json({ error: error.message })
      }
      tasks = data || []
    }
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

router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  let task = null
  
  try {
    if (DEV_MODE || !isConfigured) {
      const tasks = loadJSON('tasks.json')
      task = tasks.find(t => t.id === id)
    } else {
      const { data, error } = await supabase.from('tasks').select('*').eq('id', id).single()
      if (error) {
        console.error('Supabase error:', error.message)
        return res.status(404).json({ error: 'Task not found' })
      }
      task = data
    }
  } catch (err) {
    console.error('Error getting task:', err.message)
  }
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }
  
  res.json(task)
})

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { title, description, category, urgency, address, city, district, deadline, slots_needed, required_skills } = req.body
  
  const newTask = {
    title,
    description,
    category,
    urgency: urgency || 3,
    status: 'open',
    address,
    city,
    district,
    deadline,
    slots_needed: slots_needed || 1,
    slots_filled: 0,
    required_skills: required_skills || [],
    priority_score: 0.5,
  }
  
  try {
    if (DEV_MODE || !isConfigured) {
      const tasks = loadJSON('tasks.json')
      newTask.id = String(Date.now())
      tasks.push(newTask)
      saveJSON('tasks.json', tasks)
    } else {
      const { data, error } = await supabase.from('tasks').insert(newTask).select().single()
      if (error) {
        console.error('Supabase error:', error.message)
        return res.status(500).json({ error: error.message })
      }
      newTask = data
    }
  } catch (err) {
    console.error('Error creating task:', err.message)
    return res.status(500).json({ error: err.message })
  }
  
  res.status(201).json(newTask)
})

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params
  const updates = req.body
  
  try {
    if (DEV_MODE || !isConfigured) {
      const tasks = loadJSON('tasks.json')
      const index = tasks.findIndex(t => String(t.id) === String(id))
      if (index === -1) {
        return res.status(404).json({ error: 'Task not found' })
      }
      tasks[index] = { ...tasks[index], ...updates }
      saveJSON('tasks.json', tasks)
      res.json(tasks[index])
    } else {
      const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single()
      if (error) {
        console.error('Supabase error:', error.message)
        return res.status(500).json({ error: error.message })
      }
      res.json(data)
    }
  } catch (err) {
    console.error('Error updating task:', err.message)
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params
  
  try {
    if (DEV_MODE || !isConfigured) {
      const tasks = loadJSON('tasks.json')
      const filtered = tasks.filter(t => String(t.id) !== String(id))
      saveJSON('tasks.json', filtered)
    } else {
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) {
        console.error('Supabase error:', error.message)
        return res.status(500).json({ error: error.message })
      }
    }
  } catch (err) {
    console.error('Error deleting task:', err.message)
    return res.status(500).json({ error: err.message })
  }
  
  res.json({ success: true })
})

module.exports = router
