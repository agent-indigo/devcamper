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
const router = express.Router({ mergeParams: true })
router.route('/').get(AdvancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
}), getCourses).post(addCourse)
router.route('/:id').get(getCourse).patch(updateCourse).delete(deleteCourse)
module.exports = router