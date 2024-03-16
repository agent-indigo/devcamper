import {Router} from 'express'
import {
    showCourses,
    showCourse,
    addCourse,
    editCourse,
    deleteCourse
} from '../controllers/coursesController.mjs'
import searchFilter from '../middleware/searchFilter.mjs'
import courseModel from '../models/courseModel.mjs'
import {isLoggedIn, isAdmin} from '../middleware/securityHandler.mjs'
const coursesRouter = Router({mergeParams: true})
coursesRouter.get('/', searchFilter(courseModel, {
    path: 'bootcamp',
    select: 'name description'
}), showCourses)
coursesRouter.get('/:id', showCourse)
coursesRouter.use(isLoggedIn)
coursesRouter.use(isAdmin('admin', 'publisher'))
coursesRouter.post('/', addCourse)
coursesRouter.put('/:id', editCourse)
coursesRouter.delete('/:id', deleteCourse)
export default coursesRouter