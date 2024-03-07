import asyncHandler from '../middleware/asyncHandler.mjs'
import bootcampModel from '../models/bootcampModel.mjs'
import courseModel from '../models/courseModel.mjs'
/**
 * @name    showCourses
 * @desc    Show all courses
 * @routes  GET /api/v1/courses, GET api/v1/bootcamps/:bootcampId/courses
 * @access  public
 */
export const showCourses = asyncHandler(async(request, response, next) => {
    if(request.params.bootcampId) {
        const courses = await courseModel.find({bootcamp: request.params.bootcampId})
        return response.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        response.status(200).json(response.AdvancedResults)
    }
})
/**
 * @name    showCourse
 * @desc    Get a single course
 * @route   GET /api/v1/courses/:id
 * @access  public
 */
export const showCourse = asyncHandler(async(request, response, next) => {
    const course = await courseModel.findById(request.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })
    if(!course) throw new Error(`Course with ID of ${request.params.id} not found.`)
    response.status(200).json({
        success: true,
        data: course
    })
})
/**
 * @name    addCourse
 * @desc    Add a course
 * @route   POST /api/v1/bootcamps/:bootcampId/courses
 * @access  private
 */
export const addCourse = asyncHandler(async(request, response, next) => {
    request.body.bootcamp = request.params.bootcampId
    request.body.user = request.user.id
    const bootcamp = await bootcampModel.findById(request.params.bootcampId)
    if(!bootcamp) throw new Error(`Bootcamp with ID of ${request.params.bootcampId} not found.`)
    if(bootcamp.user.toString() !== request.user.id && request.user.role !== 'admin') throw new Error('Not authorized.')
    const course = await courseModel.create(request.body)
    response.status(200).json({
        success: true,
        data: course
    })
})
/**
 * @name    editCourse
 * @desc    Edit a course
 * @route   PUT /api/v1/courses/:id
 * @access  private
 */
export const editCourse = asyncHandler(async(request, response, next) => {
    let course = await courseModel.findById(request.params.id)
    if(!course) throw new Error(`Course with ID of ${request.params.id} not found.`)
    if(course.user.toString() !== request.user.id && request.user.role !== 'admin') throw new Error('Not authorized.')
    course = await courseModel.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true
    })
    response.status(200).json({
        success: true,
        data: course
    })
})
/**
 * @name    deleteCourse
 * @desc    Delete a course
 * @route   DELETE /api/v1/courses/:id
 * @access  private
 */
export const deleteCourse = asyncHandler(async(request, response, next) => {
    const course = await courseModel.findById(request.params.id)
    if(!course) throw new Error(`Course with ID of ${request.params.id} not found.`)
    if(course.user.toString() !== request.user.id && request.user.role !== 'admin') throw new Error('Not authorized.')
    await course.remove()
    response.status(200).json({success: true})
})