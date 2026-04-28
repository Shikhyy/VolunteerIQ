const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const { matchVolunteers } = require('../services/gemini')
const { DEV_MODE, loadJSON } = require('../middleware/devMode')

router.post('/', requireAuth, async (req, res) => {
  const { taskId } = req.body
  
  if (!taskId) {
    return res.status(400).json({ error: 'taskId required' })
  }
  
  const tasks = DEV_MODE ? loadJSON('tasks.json') : []
  const task = tasks.find(t => t.id === taskId)
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }
  
  const volunteers = DEV_MODE ? loadJSON('volunteers.json') : []
  
  try {
    const matches = await generateMatches(task, volunteers)
    res.json({ taskId, matches })
  } catch (err) {
    console.error('Match error:', err)
    res.status(500).json({ error: 'Failed to generate matches' })
  }
})

async function generateMatches(task, volunteers) {
  try {
    return await matchVolunteers(task, volunteers)
  } catch (err) {
    console.error('Gemini error, using fallback:', err.message)
    return volunteers.slice(0, 3).map(v => ({
      volunteerId: v.id,
      matchScore: 0.7 - Math.random() * 0.2,
      reason: 'Fallback match'
    }))
  }
}

module.exports = router