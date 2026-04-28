const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/auth')
const { calculatePriorityScore } = require('../services/scorer')
const { DEV_MODE, loadJSON } = require('../middleware/devMode')

router.post('/', requireAuth, (req, res) => {
  const { taskId, regionTaskCount } = req.body
  const parsedRegionTaskCount = typeof regionTaskCount === 'number' ? regionTaskCount : parseInt(regionTaskCount, 10) || 5
  
  if (!taskId) {
    return res.status(400).json({ error: 'taskId required' })
  }
  
  const tasks = DEV_MODE ? loadJSON('tasks.json') : []
  const task = tasks.find(t => t.id === taskId)
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }
  
  const result = calculatePriorityScore(task, parsedRegionTaskCount)
  
  res.json({
    taskId,
    ...result
  })
})

module.exports = router