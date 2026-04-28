const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY

const supabase = supabaseUrl ? createClient(supabaseUrl, supabaseKey) : null

module.exports = { supabase, isConfigured: !!supabaseUrl }