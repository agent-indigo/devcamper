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
// routers
const courseRouter = require('./courses')
const router = express.Router()
// reroute to other routers
router.use('/:bootcampId/courses', courseRouter)
// methods
router.route('/').get(AdvancedResults(Bootcamp, 'courses'), getBootcamps).post(addBootcamp)
// router.route('/radius/:zip/:distance').get(getBootcampsWihinRadius)
router.route('/:id').get(getBootcamp).patch(updateBootcamp).delete(deleteBootcamp)
router.route('/:id/photo').put(bootcampPhotoUpload)
module.exports = router