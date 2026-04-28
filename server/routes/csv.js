const express = require('express')
const router = express.Router()
const { DEV_MODE, loadJSON, saveJSON } = require('../middleware/devMode')
const { requireAuth, requireAdmin } = require('../middleware/auth')

router.get('/template', (req, res) => {
  const template = 'title,description,category,urgency,date,location,slots\n'
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename=tasks-template.csv')
  res.send(template)
})

router.post('/import', requireAdmin, (req, res) => {
  const { data } = req.body

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ error: 'Invalid CSV data' })
  }

  let tasks = []
  try {
    tasks = DEV_MODE ? loadJSON('tasks.json') : []
  } catch (err) {
    console.error('Error loading tasks:', err.message)
  }

  const imported = []
  for (const row of data) {
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: row.title || 'Untitled Task',
      description: row.description || '',
      category: row.category || 'general',
      urgency: parseInt(row.urgency) || 3,
      date: row.date || new Date().toISOString().split('T')[0],
      location: row.location || '',
      slots: parseInt(row.slots) || 1,
      slotsFilled: 0,
      status: 'open',
      createdAt: new Date().toISOString()
    }
    tasks.push(newTask)
    imported.push(newTask)
  }

  if (DEV_MODE) {
    try {
      saveJSON('tasks.json', tasks)
    } catch (err) {
      console.error('Error saving tasks:', err.message)
      return res.status(500).json({ error: 'Failed to save tasks' })
    }
  }

  res.status(201).json({ message: `${imported.length} tasks imported`, tasks: imported })
})

router.get('/export', requireAuth, (req, res) => {
  let tasks = []
  try {
    tasks = DEV_MODE ? loadJSON('tasks.json') : []
  } catch (err) {
    console.error('Error loading tasks:', err.message)
  }

  const headers = ['title', 'description', 'category', 'urgency', 'date', 'location', 'slots', 'status']
  const csvRows = [headers.join(',')]

  for (const task of tasks) {
    const row = headers.map(h => {
      const val = task[h] || ''
      return val.includes(',') ? `"${val}"` : val
    })
    csvRows.push(row.join(','))
  }

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename=tasks-export.csv')
  res.send(csvRows.join('\n'))
})

module.exports = router