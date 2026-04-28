const express = require('express')
const router = express.Router()
const { DEV_MODE, loadJSON, saveJSON } = require('../middleware/devMode')
const { requireAuth } = require('../middleware/auth')

router.get('/', requireAuth, (req, res) => {
  let notifications = []
  try {
    notifications = DEV_MODE ? loadJSON('notifications.json') : []
  } catch (err) {
    console.error('Error loading notifications:', err.message)
  }

  const userId = req.user?.id
  notifications = notifications.filter(n => n.userId === userId || n.userId === undefined)

  const { unreadOnly } = req.query
  if (unreadOnly === 'true') {
    notifications = notifications.filter(n => !n.read)
  }

  notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  res.json(notifications)
})

router.put('/:id/read', requireAuth, (req, res) => {
  let notifications = []
  try {
    notifications = DEV_MODE ? loadJSON('notifications.json') : []
  } catch (err) {
    console.error('Error loading notifications:', err.message)
    return res.status(500).json({ error: 'Failed to load notifications' })
  }
  const userId = req.user?.id
  const notification = notifications.find(n => n.id === req.params.id && (n.userId === userId || n.userId === undefined))

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

router.put('/read-all', requireAuth, (req, res) => {
  let notifications = []
  try {
    notifications = DEV_MODE ? loadJSON('notifications.json') : []
  } catch (err) {
    console.error('Error loading notifications:', err.message)
    return res.status(500).json({ error: 'Failed to load notifications' })
  }

  const userId = req.user?.id
  let updated = 0
  const original = [...notifications]
  notifications = notifications.map((n, i) => {
    if ((n.userId === userId || n.userId === undefined) && !n.read) {
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