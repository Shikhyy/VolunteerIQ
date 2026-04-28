const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

// Routes (create empty stubs)
app.use('/api/auth', (req, res) => res.json({ status: 'ok' }))
app.use('/api/tasks', (req, res) => res.json([]))
app.use('/api/volunteers', (req, res) => res.json([]))
app.use('/api/notifications', (req, res) => res.json([]))
app.use('/api/csv', (req, res) => res.json({ status: 'ok' }))
app.use('/api/match', (req, res) => res.json({ status: 'ok' }))
app.use('/api/score', (req, res) => res.json({ status: 'ok' }))

app.get('/api/v1/health', (req, res) => res.json({ status: 'ok', devMode: process.env.DEV_MODE === 'true' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))