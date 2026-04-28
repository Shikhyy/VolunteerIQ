const express = require('express')
const router = express.Router()
const { DEV_MODE, loadJSON, saveJSON } = require('../middleware/devMode')
const { requireAuth } = require('../middleware/auth')

router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  if (DEV_MODE) {
    return res.json({
      id: 'dev-user',
      email,
      name: 'Dev User',
      role: 'volunteer',
      token: 'dev-token-' + Date.now()
    })
  }

  res.status(401).json({ error: 'Invalid credentials' })
})

router.post('/signup', (req, res) => {
  const { email, password, name } = req.body

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name required' })
  }

  if (DEV_MODE) {
    return res.status(201).json({
      id: 'user-' + Date.now(),
      email,
      name,
      role: 'volunteer',
      token: 'dev-token-' + Date.now()
    })
  }

  res.status(201).json({
    id: 'user-' + Date.now(),
    email,
    name,
    role: 'volunteer'
  })
})

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' })
})

router.get('/me', requireAuth, (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (DEV_MODE && token?.startsWith('dev-token-')) {
    return res.json({
      id: 'dev-user',
      email: 'dev@example.com',
      name: 'Dev User',
      role: 'volunteer'
    })
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  res.json({ id: 'user-1', email: 'user@example.com', name: 'Test User', role: 'volunteer' })
})

module.exports = router