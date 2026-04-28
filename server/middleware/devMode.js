const fs = require('fs')
const path = require('path')

const DEV_MODE = process.env.DEV_MODE === 'true'

const loadJSON = (filename) => {
  const filePath = path.join(__dirname, '..', 'data', filename)
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]))
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch (err) {
    console.error(`Error loading ${filename}:`, err.message)
    return []
  }
}

const saveJSON = (filename, data) => {
  const filePath = path.join(__dirname, '..', 'data', filename)
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error(`Error saving ${filename}:`, err.message)
  }
}

module.exports = { DEV_MODE, loadJSON, saveJSON }