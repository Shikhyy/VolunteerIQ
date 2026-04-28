const express = require('express')
const router = express.Router()
const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto')
const { DEV_MODE, loadJSON, saveJSON } = require('../middleware/devMode')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null
const supabaseAdmin = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
}) : null

const LOCAL_USERS_FILE = 'auth-users.json'

const normalizeLocalUser = (user = {}) => ({
  id: user.id || `user-${Date.now()}`,
  email: user.email,
  name: user.name || user.displayName || user.email,
  role: user.role || 'volunteer',
  passwordHash: user.passwordHash || '',
  photoURL: user.photoURL || null,
})

const hashPassword = (password) => crypto.createHash('sha256').update(String(password)).digest('hex')

const loadLocalUsers = () => {
  try {
    return loadJSON(LOCAL_USERS_FILE)
  } catch (error) {
    console.error('Failed to load local users:', error.message)
    return []
  }
}

const saveLocalUsers = (users) => {
  saveJSON(LOCAL_USERS_FILE, users)
}

const getLocalTokenUser = (token) => {
  if (!token || !token.startsWith('local-')) {
    return null
  }
  const users = loadLocalUsers()
  const userId = token.replace('local-', '')
  return users.find(user => String(user.id) === String(userId)) || null
}

const syncVolunteerProfile = async (user) => {
  if (DEV_MODE) {
    const volunteers = loadJSON('volunteers.json')
    const index = volunteers.findIndex(volunteer => String(volunteer.id) === String(user.id))
    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: volunteers[index]?.phone || '',
      skills: volunteers[index]?.skills || [],
      availability: volunteers[index]?.availability || [],
      status: volunteers[index]?.status || 'active',
      tasksCompleted: volunteers[index]?.tasksCompleted || 0,
      hoursVolunteered: volunteers[index]?.hoursVolunteered || volunteers[index]?.hoursContributed || 0,
      joinedAt: volunteers[index]?.joinedAt || new Date().toISOString(),
    }

    if (index >= 0) {
      volunteers[index] = profile
    } else {
      volunteers.unshift(profile)
    }

    saveJSON('volunteers.json', volunteers)
  }
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      const users = loadLocalUsers()
      const user = users.find(entry => entry.email.toLowerCase() === String(email).toLowerCase())

      if (!user || user.passwordHash !== hashPassword(password)) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      return res.json({
        token: `local-${user.id}`,
        user: {
          uid: user.id,
          email: user.email,
          displayName: user.name,
          photoURL: user.photoURL,
          role: user.role || 'volunteer'
        }
      })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Supabase auth error:', error)
      return res.status(401).json({ error: error.message })
    }

    const { user, session } = data

    // Get user profile from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    res.json({
      token: session.access_token,
      user: {
        uid: user.id,
        email: user.email,
        displayName: profile?.full_name || user.email,
        photoURL: profile?.avatar_url,
        role: profile?.role || 'volunteer'
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name required' })
  }

  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      const users = loadLocalUsers()
      const existing = users.find(entry => entry.email.toLowerCase() === String(email).toLowerCase())

      if (existing) {
        return res.status(400).json({ error: 'Email already in use' })
      }

      const user = normalizeLocalUser({
        id: `local-${Date.now()}`,
        email,
        name,
        role: 'volunteer',
        passwordHash: hashPassword(password)
      })

      users.push(user)
      saveLocalUsers(users)
      await syncVolunteerProfile(user)

      return res.status(201).json({
        token: `local-${user.id}`,
        user: {
          uid: user.id,
          email: user.email,
          displayName: user.name,
          role: user.role
        }
      })
    }

    // Use admin API to create user without email confirmation
    const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name }
    })

    if (createError) {
      console.error('Supabase signup error:', createError)
      return res.status(400).json({ error: createError.message })
    }

    // Create profile
    if (user) {
      await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        full_name: name,
        role: 'volunteer'
      })
    }

    // Generate a token for the user (admin API doesn't return session)
    const { data: sessionData } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    res.status(201).json({
      token: sessionData.session.access_token,
      user: {
        uid: user.id,
        email: user.email,
        displayName: name,
        role: 'volunteer'
      }
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/logout', async (req, res) => {
  try {
    if (supabaseUrl && supabaseServiceKey) {
      await supabase.auth.signOut()
    }
  } catch (e) {}
  res.json({ message: 'Logged out' })
})

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    if (token.startsWith('local-')) {
      const user = getLocalTokenUser(token)
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' })
      }

      return res.json({
        user: {
          uid: user.id,
          email: user.email,
          displayName: user.name,
          photoURL: user.photoURL,
          role: user.role || 'volunteer'
        }
      })
    }

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    res.json({
      user: {
        uid: user.id,
        email: user.email,
        displayName: profile?.full_name || user.email,
        photoURL: profile?.avatar_url,
        role: profile?.role || 'volunteer'
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(401).json({ error: 'Invalid token' })
  }
})

module.exports = router
