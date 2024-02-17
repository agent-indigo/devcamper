const express = require('express')
const {
    register,
    login,
    getMe
} = require('../controllers/auth')
const router = express.Router()
const { protect } = require('../middleware/Auth')
router.post('/login', login)
router.post('/me', protect, getMe)
router.post('/register', register)
module.exports = router