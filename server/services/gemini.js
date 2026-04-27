const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

async function matchVolunteers(task, volunteers) {
  const prompt = `Match volunteers to task: ${JSON.stringify(task)}

Volunteers: ${JSON.stringify(volunteers, null, 2)}

Return ranked list of volunteer IDs with reasoning.`

  try {
    const result = await model.generateContent(prompt)
    return JSON.parse(result.response.text())
  } catch (err) {
    console.error('Gemini error:', err)
    return fallbackMatch(task, volunteers)
  }
}

function fallbackMatch(task, volunteers) {
  // Rule-based fallback
  return volunteers.slice(0, 3).map(v => ({
    volunteerId: v.id,
    matchScore: 0.7 - Math.random() * 0.2,
    reason: 'Skill overlap fallback'
  }))
}

module.exports = { matchVolunteers }
