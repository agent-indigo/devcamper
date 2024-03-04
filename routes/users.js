const express = require('express')
const {
    showUsers,
    showUser,
    addUser,
    editUser,
    deleteUser
} = require('../controllers/users')
const User = require('../models/User')
const router = express.Router({ mergeParams: true })
const AdvancedResults = require('../middleware/AdvancedResults')
const { protect, authorize } = require('../middleware/Auth')
router.use(protect, authorize('admin'))
router.route('/').get(AdvancedResults(User), showUsers).post(addUser)
router.route('/:id').get(showUser).put(editUser).delete(deleteUser)
module.exports = router