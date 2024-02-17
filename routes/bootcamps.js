// imports
const express = require('express')
const {
    getBootcamps,
    getBootcamp,
    // getBootcampsWithinRadius,
    addBootcamp,
    updateBootcamp,
    deleteBootcamp,
    bootcampPhotoUpload
} = require('../controllers/bootcamps')
const AdvancedResults = require('../middleware/AdvancedResults')
const Bootcamp = require('../models/Bootcamp')
const { protect, authorize } = require('../middleware/Auth')
// routers
const courseRouter = require('./courses')
const router = express.Router()
// reroute to other routers
router.use('/:bootcampId/courses', courseRouter)
// methods
router.route('/').get(AdvancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, authorize('admin', 'publisher'), addBootcamp)
// router.route('/radius/:zip/:distance').get(getBootcampsWihinRadius)
router.route('/:id').get(getBootcamp).patch(protect, authorize('admin', 'publisher'), updateBootcamp).delete(protect, authorize('admin', 'publisher'), deleteBootcamp)
router.route('/:id/photo').put(protect, authorize('admin', 'publisher'), bootcampPhotoUpload)
module.exports = router