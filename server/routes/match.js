const express = require('express')
const router = express.Router()

const availableTasks = [
  { id: '1', title: 'Medical camp setup — Okhla', description: 'Set up a 50-bed medical camp for flood relief.', category: 'Medical', urgency: 5, status: 'in_progress', slots_needed: 8, required_skills: ['Medical', 'Logistics'] },
  { id: '2', title: 'Food packet distribution — Rohini', description: 'Distribute food packets to flood-affected families.', category: 'Logistics', urgency: 4, status: 'open', slots_needed: 6, required_skills: ['Logistics'] },
  { id: '3', title: 'Teaching support — Dwarka', description: 'Help students with their studies.', category: 'Teaching', urgency: 3, status: 'open', slots_needed: 4, required_skills: ['Teaching'] },
  { id: '4', title: 'Elderly care home — Janakpuri', description: 'Assist with daily activities.', category: 'Admin', urgency: 2, status: 'open', slots_needed: 3, required_skills: ['Admin'] },
  { id: '5', title: 'Mobile clinic — Sarojini Nagar', description: 'Support mobile health clinic.', category: 'Medical', urgency: 4, status: 'open', slots_needed: 5, required_skills: ['Medical', 'Admin'] },
  { id: '6', title: 'Shelter construction — Narela', description: 'Help build temporary shelters.', category: 'Construction', urgency: 5, status: 'open', slots_needed: 10, required_skills: ['Construction', 'Logistics'] }
]

function scoreMatch(task, volunteerSkills) {
  const taskSkills = task.required_skills.map(s => s.toLowerCase())
  const volSkills = volunteerSkills.map(s => s.toLowerCase())
  
  const matched = taskSkills.filter(s => volSkills.includes(s)).length
  const score = taskSkills.length > 0 ? matched / taskSkills.length : 0
  
  if (matched === taskSkills.length) return score + 0.3
  if (matched > 0) return score + 0.1
  return score
}

function getMatchReason(task, volunteerSkills) {
  const taskSkills = task.required_skills.map(s => s.toLowerCase())
  const volSkills = volunteerSkills.map(s => s.toLowerCase())
  const matched = taskSkills.filter(s => volSkills.includes(s))
  
  if (matched.length === taskSkills.length) return 'Perfect skill match!'
  if (matched.length > 0) return `Matches: ${matched.join(', ')}`
  return 'No specific skill match'
}

router.post('/suggest', async (req, res) => {
  const { skills, preferences } = req.body

  if (!skills || !Array.isArray(skills)) {
    return res.status(400).json({ error: 'skills array required' })
  }

  const scored = availableTasks.map(task => ({
    taskId: task.id,
    task,
    score: scoreMatch(task, skills),
    reason: getMatchReason(task, skills)
  }))

  scored.sort((a, b) => b.score - a.score)

  const matches = scored.slice(0, 5).map(s => ({
    taskId: s.taskId,
    reason: s.reason,
    score: Math.round(s.score * 100) / 100
  }))

  res.json({ skills, matches })
})

router.get('/tasks', (req, res) => {
  res.json(availableTasks)
})

module.exports = router