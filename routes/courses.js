const express = require('express')
const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses')
const AdvancedResults = require('../middleware/AdvancedResults')
const Course = require('../models/Course')
const { protect, authorize } = require('../middleware/Auth')
const router = express.Router({ mergeParams: true })
router.route('/').get(AdvancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
}), getCourses).post(protect, authorize('admin', 'publisher'), addCourse)
router.route('/:id').get(getCourse).patch(protect, authorize('admin', 'publisher'), updateCourse).delete(protect, authorize('admin', 'publisher'), deleteCourse)
module.exports = router