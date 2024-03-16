import {Router} from 'express'
import {
    showBootcamps,
    showBootcampsWihinRadius,
    showBootcamp,
    addBootcamp,
    editBootcamp,
    deleteBootcamp,
    bootcampPhotoUpload
} from '../controllers/bootcampsController.mjs'
import searchFilter from '../middleware/searchFilter.mjs'
import bootcampModel from '../models/bootcampModel.mjs'
import {isLoggedIn, isAdmin} from '../middleware/securityHandler.mjs'
import coursesRouter from './coursesRouter.mjs'
import reviewsRouter from './reviewsRouter.mjs'
const bootcampsRouter = Router()
bootcampsRouter.use('/:bootcampId/courses', coursesRouter)
bootcampsRouter.use('/:bootcampId/reviews', reviewsRouter)
bootcampsRouter.route('/').get(searchFilter(bootcampModel, 'courses'), showBootcamps).post(isLoggedIn, isAdmin('admin', 'publisher'), addBootcamp)
bootcampsRouter.route('/radius/:zip/:distance').get(showBootcampsWihinRadius)
bootcampsRouter.route('/:id').get(showBootcamp).put(isLoggedIn, isAdmin('admin', 'publisher'), editBootcamp).delete(isLoggedIn, isAdmin('admin', 'publisher'), deleteBootcamp)
bootcampsRouter.route('/:id/photo').put(isLoggedIn, isAdmin('admin', 'publisher'), bootcampPhotoUpload)
export default bootcampsRouter