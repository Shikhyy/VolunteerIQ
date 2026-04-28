const express = require('express')
const router = express.Router()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const GROQ_API_KEY = process.env.GROQ_API_KEY

function parseGroqJson(text, taskMap) {
  if (!text) return null
  
  try {
    // Try direct JSON parse
    const arr = JSON.parse(text)
    if (Array.isArray(arr)) {
      return arr.map(item => ({
        taskId: String(item.taskId || item.id || item.task_id || 'unknown'),
        score: item.score ? parseFloat(item.score) : 0.5,
        reason: item.reason || item.reasoning || 'Matched'
      }))
    }
  } catch (e) {
    // Manual extract
    const results = []
    const lines = text.split('\n').filter(l => l.includes('taskId') || l.includes('id:'))
    for (const line of lines) {
      const idMatch = line.match(/(?:taskId|id|id:)["']?[:\s]+["']?([^"'\s,}]+)/)
      const scoreMatch = line.match(/score["']?[:\s]+([0-9.]+)/)
      const reasonMatch = line.match(/reason["']?[:\s]+["']([^"']+)["']/)
      
      if (idMatch && taskMap[idMatch[1]]) {
        results.push({
          taskId: taskMap[idMatch[1]],
          score: scoreMatch ? parseFloat(scoreMatch[1]) : 0.5,
          reason: reasonMatch ? reasonMatch[1] : 'Matched'
        })
      }
    }
    return results.length > 0 ? results : null
  }
  return null
}

async function fetchFromGroq(prompt) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1000
      })
    })
    
    if (!response.ok) throw new Error(`Groq ${response.status}`)
    
    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  } catch (e) {
    console.log('Groq error:', e.message)
    throw e
  }
}

async function fetchTasksFromInternet() {
  const prompt = `Generate 6 real volunteer tasks in India. JSON array: [{"title":"Title","description":"Desc","category":"Medical","urgency":1,"slots_needed":5,"required_skills":["Skill"],"city":"Delhi","district":"South"}]`
  try {
    return await fetchFromGroq(prompt)
  } catch (e) { return null }
}

function scoreMatch(task, volunteerSkills) {
  const taskSkills = (task.required_skills || []).map(s => s.toLowerCase())
  const volSkills = volunteerSkills.map(s => s.toLowerCase())
  
  const matched = taskSkills.filter(s => volSkills.includes(s)).length
  const score = taskSkills.length > 0 ? matched / taskSkills.length : 0
  
  return (matched === taskSkills.length ? score + 0.3 : matched > 0 ? score + 0.1 : score)
}

function getMatchReason(task, volunteerSkills) {
  const taskSkills = (task.required_skills || []).map(s => s.toLowerCase())
  const volSkills = volunteerSkills.map(s => s.toLowerCase())
  const matched = taskSkills.filter(s => volSkills.includes(s))
  
  return matched.length === taskSkills.length ? 'Perfect!' : matched.length > 0 ? `Matches: ${matched.join(', ')}` : 'Available'
}

router.post('/suggest', async (req, res) => {
  const { skills } = req.body

  if (!skills || !Array.isArray(skills)) {
    return res.status(400).json({ error: 'skills array required' })
  }

  try {
    const { data: tasks } = await supabase.from('tasks').select('*')
    const availableTasks = tasks || []
    
    // Build task ID map: index -> id
    const taskMap = {}
    const idMap = {}
    availableTasks.forEach((t, i) => {
      taskMap[String(i + 1)] = t.id
      idMap[t.id] = i + 1
    })

    // Try Groq
    if (availableTasks.length > 0 && GROQ_API_KEY) {
      try {
        const prompt = `Skills: ${skills.join(', ')}. Tasks (id -> title): ${availableTasks.map((t, i) => `${i+1}: ${t.title}`).join(', ')}. Return JSON array sorted by match: [{"taskId":"1","score":0.9,"reason":"Matches skills"}]`
        
        const text = await fetchFromGroq(prompt)
        const aiMatches = parseGroqJson(text, taskMap)
        
        if (aiMatches && aiMatches.length > 0) {
          // Map taskId from Groq to actual DB id
          const mapped = aiMatches.map(m => ({
            taskId: taskMap[m.taskId] || m.taskId,
            score: m.score,
            reason: m.reason
          }))
          return res.json({ skills, matches: mapped, source: 'groq' })
        }
      } catch (e) {
        console.log('Groq failed:', e.message)
      }
    }

    // Rule-based fallback
    const scored = availableTasks.map(t => ({
      taskId: t.id,
      score: scoreMatch(t, skills),
      reason: getMatchReason(t, skills)
    }))

    scored.sort((a, b) => b.score - a.score)

    res.json({ 
      skills, 
      matches: scored.slice(0, 5).map(s => ({ ...s, score: Math.round(s.score * 100) / 100 })), 
      source: 'rule-based' 
    })
  } catch (err) {
    console.error('Match error:', err)
    res.status(500).json({ error: 'Failed to generate suggestions' })
  }
})

router.get('/tasks', async (req, res) => {
  try {
    const { data } = await supabase.from('tasks').select('*')
    res.json(data || [])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/refresh', async (req, res) => {
  try {
    const raw = await fetchTasksFromInternet()
    // Save to DB - simplified
    res.json({ message: 'Refresh endpoint ready' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router