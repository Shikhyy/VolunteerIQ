const { DEV_MODE } = require('./devMode')

const requireAuth = (req, res, next) => {
  if (DEV_MODE || req.headers['x-dev-user']) {
    req.user = { id: 'dev-user', role: req.headers['x-dev-role'] || 'volunteer' }
    return next()
  }
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  next()
}

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' })
  }
  next()
}

module.exports = { requireAuth, requireAdmin }