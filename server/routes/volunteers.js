const express = require('express')
const router = express.Router()
const { DEV_MODE, loadJSON, saveJSON } = require('../middleware/devMode')
const { requireAuth, requireAdmin } = require('../middleware/auth')

const normalizeVolunteer = (volunteer = {}) => ({
  ...volunteer,
  name: volunteer.name || volunteer.displayName || 'Volunteer',
  email: volunteer.email || '',
  phone: volunteer.phone || '',
  skills: Array.isArray(volunteer.skills) ? volunteer.skills : [],
  availability: Array.isArray(volunteer.availability) ? volunteer.availability : [],
  status: volunteer.status || 'active',
  tasksCompleted: Number(volunteer.tasksCompleted ?? volunteer.tasks_completed ?? volunteer.completedTasks ?? 0),
  hoursVolunteered: Number(volunteer.hoursVolunteered ?? volunteer.hoursContributed ?? volunteer.hours_contributed ?? 0),
  joinedAt: volunteer.joinedAt || volunteer.joined_at || new Date().toISOString(),
})

const loadVolunteers = () => {
  try {
    return DEV_MODE ? loadJSON('volunteers.json') : []
  } catch (err) {
    console.error('Error loading volunteers:', err.message)
    return []
  }
}

const saveVolunteers = (volunteers) => {
  if (DEV_MODE) {
    saveJSON('volunteers.json', volunteers)
  }
}

const upsertMe = (req, res) => {
  const volunteers = loadVolunteers()
  const id = req.user?.id || 'dev-user'
  const index = volunteers.findIndex(v => String(v.id) === String(id))
  const existing = index >= 0 ? volunteers[index] : { id, ...volunteers[0], name: req.body.name || volunteers[0]?.name || 'Volunteer' }
  const merged = normalizeVolunteer({
    ...existing,
    ...req.body,
    id,
    tasksCompleted: req.body.tasksCompleted ?? existing.tasksCompleted,
    hoursVolunteered: req.body.hoursVolunteered ?? existing.hoursVolunteered,
  })

  if (index >= 0) {
    volunteers[index] = merged
  } else {
    volunteers.unshift(merged)
  }

  saveVolunteers(volunteers)

  return res.json({ user: merged })
}

router.get('/', requireAuth, (req, res) => {
  let volunteers = loadVolunteers().map(normalizeVolunteer)

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

router.get('/me', requireAuth, (req, res) => {
  const volunteers = loadVolunteers()
  const id = req.user?.id || 'dev-user'
  const found = volunteers.find(v => String(v.id) === String(id))
  if (found) {
    return res.json({ user: normalizeVolunteer(found) })
  }

  return res.json({ user: normalizeVolunteer({ id, ...volunteers[0], name: volunteers[0]?.name || 'Volunteer' }) })
})

router.get('/:id', requireAuth, (req, res) => {
  const volunteers = loadVolunteers()
  if (volunteers.length === 0) {
    return res.status(500).json({ error: 'Failed to load volunteers' })
  }
  const volunteer = volunteers.find(v => String(v.id) === String(req.params.id))

  if (!volunteer) {
    return res.status(404).json({ error: 'Volunteer not found' })
  }

  res.json(normalizeVolunteer(volunteer))
})

router.put('/me', requireAuth, (req, res) => {
  return upsertMe(req, res)
})

router.put('/:id', requireAuth, requireAdmin, (req, res) => {
  let volunteers = loadVolunteers()
  if (volunteers.length === 0) {
    return res.status(500).json({ error: 'Failed to load volunteers' })
  }
  const index = volunteers.findIndex(v => String(v.id) === String(req.params.id))

  if (index === -1) {
    return res.status(404).json({ error: 'Volunteer not found' })
  }

  const allowedFields = ['name', 'email', 'phone', 'skills', 'status', 'availability', 'hoursVolunteered', 'hoursContributed', 'tasksCompleted']
  const updates = {}
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field]
    }
  }

  volunteers[index] = normalizeVolunteer({ ...volunteers[index], ...updates, updatedAt: new Date().toISOString() })

  if (DEV_MODE) {
    try {
      saveJSON('volunteers.json', volunteers)
    } catch (err) {
      console.error('Error saving volunteers:', err.message)
      return res.status(500).json({ error: 'Failed to save volunteer' })
    }
  }

  res.json(normalizeVolunteer(volunteers[index]))
})

module.exports = router