const express = require('express')
const router = express.Router()

router.post('/match', async (req, res) => {
  res.json({ matchId: 'test', ranked: [{ volunteerId: 'v1', matchScore: 0.9 }] })
})

router.post('/score', (req, res) => {
  res.json({ taskId: req.body.taskId, priorityScore: 0.91 })
})

module.exports = router
