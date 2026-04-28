const express = require('express')
const router = express.Router()
const { DEV_MODE, loadJSON, saveJSON } = require('../middleware/devMode')
const { requireAuth } = require('../middleware/auth')

router.get('/', (req, res) => {
  let notifications = []
  try {
    notifications = DEV_MODE ? loadJSON('notifications.json') : []
  } catch (err) {
    console.error('Error loading notifications:', err.message)
  }

  const { unreadOnly } = req.query
  if (unreadOnly === 'true') {
    notifications = notifications.filter(n => !n.read)
  }

  notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  res.json(notifications)
})

router.put('/:id/read', (req, res) => {
  let notifications = []
  try {
    notifications = DEV_MODE ? loadJSON('notifications.json') : []
  } catch (err) {
    console.error('Error loading notifications:', err.message)
    return res.status(500).json({ error: 'Failed to load notifications' })
  }
  const notification = notifications.find(n => n.id === req.params.id)

  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' })
  }
  const index = notifications.findIndex(n => n.id === req.params.id)

  notifications[index].read = true
  notifications[index].readAt = new Date().toISOString()

  if (DEV_MODE) {
    try {
      saveJSON('notifications.json', notifications)
    } catch (err) {
      console.error('Error saving notifications:', err.message)
      return res.status(500).json({ error: 'Failed to save notification' })
    }
  }

  res.json(notifications[index])
})

router.put('/read-all', (req, res) => {
  let notifications = []
  try {
    notifications = DEV_MODE ? loadJSON('notifications.json') : []
  } catch (err) {
    console.error('Error loading notifications:', err.message)
    return res.status(500).json({ error: 'Failed to load notifications' })
  }

  let updated = 0
  notifications = notifications.map((n, i) => {
    if (!n.read) {
      updated++
      return { ...n, read: true, readAt: new Date().toISOString() }
    }
    return n
  })

  if (DEV_MODE) {
    try {
      saveJSON('notifications.json', notifications)
    } catch (err) {
      console.error('Error saving notifications:', err.message)
      return res.status(500).json({ error: 'Failed to save notifications' })
    }
  }

  res.json({ message: `${updated} notifications marked as read` })
})

module.exports = router