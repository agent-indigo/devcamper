// imports
const AsyncHandler = require('../middleware/AsyncHandler')
const Bootcamp = require('../models/Bootcamp')
const Course = require('../models/Course')
const ErrorResponse = require('../utilities/ErrorResponse')
// methods
/**
 * @name    showCourses
 * @desc    Show all courses
 * @routes  GET /api/v1/courses, GET api/v1/bootcamps/:bootcampId/courses
 * @access  public
 */
exports.showCourses = AsyncHandler(async(request, response, next) => {
    if(request.params.bootcampId) {
        const courses = await Course.find({ bootcamp: request.params.bootcampId })
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
exports.showCourse = AsyncHandler(async(request, response, next) => {
    const course = await Course.findById(request.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })
    if(!course) return next(ErrorResponse(`Course with ID of ${request.params.id} not found.`, 404))
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
exports.addCourse = AsyncHandler(async(request, response, next) => {
    request.body.bootcamp = request.params.bootcampId
    request.body.user = request.user.id
    const bootcamp = await Bootcamp.findById(request.params.bootcampId)
    if(!bootcamp) return next(ErrorResponse(`Bootcamp with ID of ${request.params.bootcampId} not found.`, 404))
    // verify that user is bootcamp owner
    if(bootcamp.user.toString() !== request.user.id && request.user.role !== 'admin') return next(ErrorResponse('Not authorized.', 401))
    const course = await Course.create(request.body)
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
exports.editCourse = AsyncHandler(async(request, response, next) => {
    let course = await Course.findById(request.params.id)
    if(!course) return next(ErrorResponse(`Course with ID of ${request.params.id} not found.`, 404))
    // verify that user is course owner
    if(course.user.toString() !== request.user.id && request.user.role !== 'admin') return next(ErrorResponse('Not authorized.', 401))
    course = await Course.findByIdAndUpdate(request.params.id, request.body, {
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
exports.deleteCourse = AsyncHandler(async(request, response, next) => {
    const course = await Course.findById(request.params.id)
    if(!course) return next(ErrorResponse(`Course with ID of ${request.params.id} not found.`, 404))
    // verify that user is course owner
    if(course.user.toString() !== request.user.id && request.user.role !== 'admin') return next(ErrorResponse('Not authorized.', 401))
    await course.remove()
    response.status(200).json({ success: true })
})