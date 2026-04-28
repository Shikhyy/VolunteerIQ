const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

const authRoutes = require('./routes/api')
const tasksRoutes = require('./routes/tasks')
const matchRoutes = require('./routes/match')
const scoreRoutes = require('./routes/score')

app.use('/api/auth', authRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/match', matchRoutes)
app.use('/api/score', scoreRoutes)

app.get('/api/v1/health', (req, res) => res.json({ status: 'ok', devMode: process.env.DEV_MODE === 'true' }))

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err, req, res, next) => {
  console.error('Server error:', err.message)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))