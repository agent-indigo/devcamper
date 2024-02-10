const express = require('express')
const { getBootcamps, getBootcamp, addBootcamp, updateBootcamp, deleteBootcamp } = require('../controllers/bootcamps')
const router = express.Router()
router.route('/').get(getBootcamps).post(addBootcamp)
router.route('/:id').get(getBootcamp).patch(updateBootcamp).delete(deleteBootcamp)
module.exports = router