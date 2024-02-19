const express = require('express')
const {
    register,
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    editUser,
    changePassword
} = require('../controllers/auth')
const router = express.Router()
const { protect } = require('../middleware/Auth')
router.post('/login', login)
router.get('/logout', logout)
router.post('/me', protect, getMe)
router.post('/register', register)
router.patch('/editUser', protect, editUser)
router.patch('/changePassword', protect, changePassword)
router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:passwordResetToken', resetPassword)
module.exports = router