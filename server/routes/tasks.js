const express = require('express')
const router = express.Router()
const { DEV_MODE, loadJSON, saveJSON } = require('../middleware/devMode')
const { requireAuth, requireAdmin } = require('../middleware/auth')
const { supabase, isConfigured } = require('../services/supabase')
const { matchVolunteers } = require('../services/gemini')

const normalizeTask = (task = {}) => {
  const location = typeof task.location === 'string'
    ? { address: task.location, city: task.city || '', district: task.region || task.district || '' }
    : {
        address: task.location?.address || task.address || '',
        city: task.location?.city || task.city || '',
        district: task.location?.district || task.district || task.region || '',
      }

  const slotsNeeded = Number(task.slotsNeeded ?? task.slots_needed ?? task.slots ?? 1)
  const slotsFilled = Number(task.slotsFilled ?? task.slots_filled ?? 0)
  const requiredSkills = Array.isArray(task.requiredSkills ?? task.required_skills) ? (task.requiredSkills ?? task.required_skills) : []

  return {
    ...task,
    title: task.title || 'Untitled Task',
    description: task.description || '',
    category: task.category || 'General',
    urgency: Number(task.urgency ?? 3),
    status: task.status || 'open',
    deadline: task.deadline || task.date || '',
    slotsNeeded,
    slots_needed: slotsNeeded,
    slotsFilled,
    slots_filled: slotsFilled,
    requiredSkills,
    required_skills: requiredSkills,
    location,
    city: location.city,
    district: location.district,
    region: task.region || location.district,
    createdAt: task.createdAt || task.created_at || new Date().toISOString(),
  }
}

const loadTasks = () => {
  try {
    if (DEV_MODE || !isConfigured) {
      return loadJSON('tasks.json').map(normalizeTask)
    }
    return []
  } catch (err) {
    console.error('Error loading tasks:', err.message)
    return []
  }
}

const saveTasks = (tasks) => {
  if (DEV_MODE || !isConfigured) {
    saveJSON('tasks.json', tasks)
  }
}

const loadNotifications = () => {
  try {
    return DEV_MODE ? loadJSON('notifications.json') : []
  } catch (err) {
    console.error('Error loading notifications:', err.message)
    return []
  }
}

const saveNotifications = (notifications) => {
  if (DEV_MODE) {
    saveJSON('notifications.json', notifications)
  }
}

router.get('/', async (req, res) => {
  let tasks = []
  
  try {
    if (DEV_MODE || !isConfigured) {
      tasks = loadTasks()
    } else {
      const { data, error } = await supabase.from('tasks').select('*')
      if (error) {
        return res.status(500).json({ error: error.message })
      }
      tasks = (data || []).map(normalizeTask)
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

router.post('/:id/apply', requireAuth, async (req, res) => {
  const { id } = req.params
  const tasks = loadTasks()
  const taskIndex = tasks.findIndex(t => String(t.id) === String(id))

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' })
  }

  const task = tasks[taskIndex]
  const nextFilled = Math.min((task.slotsFilled || 0) + 1, task.slotsNeeded || 1)
  const updatedTask = normalizeTask({
    ...task,
    slotsFilled: nextFilled,
    status: nextFilled >= (task.slotsNeeded || 1) ? 'completed' : task.status,
  })

  tasks[taskIndex] = updatedTask
  saveTasks(tasks)

  const notifications = loadNotifications()
  notifications.unshift({
    id: `notif-${Date.now()}`,
    type: 'task_assigned',
    title: `Application received for ${updatedTask.title}`,
    body: 'A volunteer applied to this task.',
    read: false,
    createdAt: new Date().toISOString(),
  })
  saveNotifications(notifications)

  res.json(updatedTask)
})

router.post('/:id/match', async (req, res) => {
  const { id } = req.params
  const tasks = loadTasks()
  const task = tasks.find(t => String(t.id) === String(id))

  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }

  let volunteers = []
  try {
    const volunteerData = DEV_MODE ? loadJSON('volunteers.json') : []
    volunteers = volunteerData.map(v => ({
      ...v,
      skills: Array.isArray(v.skills) ? v.skills : [],
      availability: Array.isArray(v.availability) ? v.availability : [],
      status: v.status || 'active',
    }))
  } catch (err) {
    console.error('Error loading volunteers:', err.message)
  }

  const requested = volunteers.filter(v => v.status !== 'inactive')

  try {
    const aiMatches = await matchVolunteers(task, requested)
    const matches = (Array.isArray(aiMatches) ? aiMatches : []).map((match) => {
      const volunteer = requested.find(v => String(v.id) === String(match.volunteerId))
      return {
        volunteerId: volunteer?.id || match.volunteerId,
        name: volunteer?.name || match.name || 'Volunteer',
        matchScore: Number(match.matchScore ?? match.score ?? 0.5),
        aiReasoning: match.reason || match.aiReasoning || 'Strong fit',
        skillOverlapPct: match.skillOverlapPct ?? Math.round((Number(match.matchScore ?? match.score ?? 0.5) * 100) / 2),
        distanceKm: match.distanceKm ?? 0,
      }
    })

    if (matches.length > 0) {
      return res.json({ taskId: id, matches })
    }
  } catch (err) {
    console.error('Match generation error:', err.message)
  }

  const taskSkills = (task.requiredSkills || []).map(skill => String(skill).toLowerCase())
  const fallback = requested.map((volunteer) => {
    const volunteerSkills = (volunteer.skills || []).map(skill => String(skill).toLowerCase())
    const overlap = taskSkills.filter(skill => volunteerSkills.includes(skill)).length
    const matchScore = taskSkills.length > 0 ? overlap / taskSkills.length : 0.5
    return {
      volunteerId: volunteer.id,
      name: volunteer.name,
      matchScore: Number((matchScore + (volunteer.status === 'active' ? 0.1 : 0)).toFixed(2)),
      aiReasoning: overlap > 0 ? `Matches ${overlap} required skill${overlap === 1 ? '' : 's'}` : 'Available volunteer',
      skillOverlapPct: taskSkills.length > 0 ? Math.round((overlap / taskSkills.length) * 100) : 0,
      distanceKm: 0,
    }
  }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5)

  res.json({ taskId: id, matches: fallback })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  let task = null
  
  try {
    if (DEV_MODE || !isConfigured) {
      const tasks = loadTasks()
      task = tasks.find(t => String(t.id) === String(id))
    } else {
      const { data, error } = await supabase.from('tasks').select('*').eq('id', id).single()
      if (error) {
        console.error('Supabase error:', error.message)
        return res.status(404).json({ error: 'Task not found' })
      }
      task = normalizeTask(data)
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
  const { title, description, category, urgency, address, city, district, deadline } = req.body
  const slotsNeeded = req.body.slotsNeeded ?? req.body.slots_needed ?? req.body.slots ?? 1
  const requiredSkills = req.body.requiredSkills ?? req.body.required_skills ?? []
  
  let newTask = normalizeTask({
    title,
    description,
    category,
    urgency: urgency || 3,
    status: 'open',
    address,
    city,
    district,
    deadline,
    slotsNeeded,
    slotsFilled: 0,
    requiredSkills,
    priority_score: 0.5,
  })
  
  try {
    if (DEV_MODE || !isConfigured) {
      const tasks = loadTasks()
      newTask.id = String(Date.now())
      tasks.push(newTask)
      saveTasks(tasks)
    } else {
      const { data, error } = await supabase.from('tasks').insert(newTask).select().single()
      if (error) {
        console.error('Supabase error:', error.message)
        return res.status(500).json({ error: error.message })
      }
      newTask = normalizeTask(data)
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
      const tasks = loadTasks()
      const index = tasks.findIndex(t => String(t.id) === String(id))
      if (index === -1) {
        return res.status(404).json({ error: 'Task not found' })
      }
      tasks[index] = normalizeTask({ ...tasks[index], ...updates })
      saveTasks(tasks)
      res.json(tasks[index])
    } else {
      const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single()
      if (error) {
        console.error('Supabase error:', error.message)
        return res.status(500).json({ error: error.message })
      }
      res.json(normalizeTask(data))
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
      const tasks = loadTasks()
      const filtered = tasks.filter(t => String(t.id) !== String(id))
      saveTasks(filtered)
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
