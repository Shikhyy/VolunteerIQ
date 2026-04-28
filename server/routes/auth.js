const express = require('express')
const router = express.Router()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  try {
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
    await supabase.auth.signOut()
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
