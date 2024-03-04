const express = require('express')
const {
    showCourses,
    showCourse,
    addCourse,
    editCourse,
    deleteCourse
} = require('../controllers/courses')
const AdvancedResults = require('../middleware/AdvancedResults')
const Course = require('../models/Course')
const { protect, authorize } = require('../middleware/Auth')
const router = express.Router({ mergeParams: true })
router.route('/').get(AdvancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
}), showCourses).post(protect, authorize('admin', 'publisher'), addCourse)
router.route('/:id').get(showCourse).put(protect, authorize('admin', 'publisher'), editCourse).delete(protect, authorize('admin', 'publisher'), deleteCourse)
module.exports = router