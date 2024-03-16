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
bootcampsRouter.get('/', searchFilter(bootcampModel, 'courses'), showBootcamps)
bootcampsRouter.get('/:id', showBootcamp)
bootcampsRouter.use(isLoggedIn)
bootcampsRouter.get('/radius/:zip/:distance', showBootcampsWihinRadius)
bootcampsRouter.use(isAdmin('admin', 'publisher'))
bootcampsRouter.post('/', addBootcamp)
bootcampsRouter.put('/:id', editBootcamp)
bootcampsRouter.delete('/:id', deleteBootcamp)
bootcampsRouter.put('/:id/photo', bootcampPhotoUpload)
export default bootcampsRouter