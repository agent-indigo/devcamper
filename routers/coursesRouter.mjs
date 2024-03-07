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
import {isAdmin} from '../middleware/securityHandler.mjs'
const coursesRouter = Router({mergeParams: true})
coursesRouter.route('/').get(searchFilter(courseModel, {
    path: 'bootcamp',
    select: 'name description'
}), showCourses).post(isAdmin('admin', 'publisher'), addCourse)
coursesRouter.route('/:id').get(showCourse).put(isAdmin('admin', 'publisher'), editCourse).delete(isAdmin('admin', 'publisher'), deleteCourse)
export default coursesRouter