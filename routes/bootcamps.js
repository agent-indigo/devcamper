// imports
const express = require('express')
const {
    showBootcamps,
    showBootcamp,
    // showBootcampsWithinRadius,
    addBootcamp,
    editBootcamp,
    deleteBootcamp,
    bootcampPhotoUpload
} = require('../controllers/bootcamps')
const AdvancedResults = require('../middleware/AdvancedResults')
const Bootcamp = require('../models/Bootcamp')
const { protect, authorize } = require('../middleware/Auth')
// routers
const courseRouter = require('./courses')
const reviewRouter = require('./reviews')
const router = express.Router()
// reroute to other routers
router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewRouter)
// methods
router.route('/').get(AdvancedResults(Bootcamp, 'courses'), showBootcamps).post(protect, authorize('admin', 'publisher'), addBootcamp)
// router.route('/radius/:zip/:distance').get(showBootcampsWihinRadius)
router.route('/:id').get(showBootcamp).patch(protect, authorize('admin', 'publisher'), editBootcamp).delete(protect, authorize('admin', 'publisher'), deleteBootcamp)
router.route('/:id/photo').put(protect, authorize('admin', 'publisher'), bootcampPhotoUpload)
module.exports = router