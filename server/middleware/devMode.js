const fs = require('fs')
const path = require('path')

const DEV_MODE = process.env.DEV_MODE === 'true'

const loadJSON = (filename) => {
  const filePath = path.join(__dirname, '..', 'data', filename)
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]))
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

const saveJSON = (filename, data) => {
  const filePath = path.join(__dirname, '..', 'data', filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

module.exports = { DEV_MODE, loadJSON, saveJSON }