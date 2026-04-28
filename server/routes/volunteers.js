const express = require('express')
const router = express.Router()
const { DEV_MODE, loadJSON, saveJSON } = require('../middleware/devMode')
const { requireAuth, requireAdmin } = require('../middleware/auth')

router.get('/', requireAuth, (req, res) => {
  let volunteers = []
  try {
    volunteers = DEV_MODE ? loadJSON('volunteers.json') : []
  } catch (err) {
    console.error('Error loading volunteers:', err.message)
  }

  const { skills, status, search } = req.query

  if (skills) {
    const skillList = skills.split(',').map(s => s.trim().toLowerCase())
    volunteers = volunteers.filter(v =>
      v.skills?.some(s => skillList.includes(s.toLowerCase()))
    )
  }
  if (status) {
    volunteers = volunteers.filter(v => v.status === status)
  }
  if (search) {
    const q = search.toLowerCase()
    volunteers = volunteers.filter(
      v => v.name?.toLowerCase().includes(q) ||
           v.email?.toLowerCase().includes(q)
    )
  }

  res.json(volunteers)
})

router.get('/:id', requireAuth, (req, res) => {
  let volunteers = []
  try {
    volunteers = DEV_MODE ? loadJSON('volunteers.json') : []
  } catch (err) {
    console.error('Error loading volunteers:', err.message)
  }
  const volunteer = volunteers.find(v => v.id === req.params.id)

  if (!volunteer) {
    return res.status(404).json({ error: 'Volunteer not found' })
  }

  res.json(volunteer)
})

router.put('/:id', requireAuth, (req, res) => {
  let volunteers = []
  try {
    volunteers = DEV_MODE ? loadJSON('volunteers.json') : []
  } catch (err) {
    console.error('Error loading volunteers:', err.message)
    return res.status(500).json({ error: 'Failed to load volunteers' })
  }
  const index = volunteers.findIndex(v => v.id === req.params.id)

  if (index === -1) {
    return res.status(404).json({ error: 'Volunteer not found' })
  }

  volunteers[index] = { ...volunteers[index], ...req.body, updatedAt: new Date().toISOString() }

  if (DEV_MODE) {
    try {
      saveJSON('volunteers.json', volunteers)
    } catch (err) {
      console.error('Error saving volunteers:', err.message)
      return res.status(500).json({ error: 'Failed to save volunteer' })
    }
  }

  res.json(volunteers[index])
})

module.exports = router