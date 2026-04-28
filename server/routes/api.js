const express = require('express')
const router = express.Router()

router.post('/csv', (req, res) => {
  res.json({ status: 'ok' })
})

module.exports = router
