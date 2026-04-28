const { DEV_MODE } = require('./devMode')

const requireAuth = (req, res, next) => {
  if (DEV_MODE) {
    req.user = { id: 'dev-user', role: req.headers['x-dev-role'] || 'volunteer' }
    return next()
  }
  
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    // Allow requests without token for now (public access)
    req.user = null
    return next()
  }
  
  // In production, verify token with Supabase
  req.user = { id: 'user-from-token' }
  next()
}

const requireAdmin = (req, res, next) => {
  if (DEV_MODE && req.user?.role === 'admin') {
    return next()
  }
  if (!DEV_MODE && req.user?.role === 'admin') {
    return next()
  }
  // Allow in dev mode for testing
  if (DEV_MODE) {
    return next()
  }
  return res.status(403).json({ error: 'Admin only' })
}

module.exports = { requireAuth, requireAdmin }
