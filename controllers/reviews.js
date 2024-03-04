const AsyncHandler = require('../middleware/AsyncHandler')
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utilities/ErrorResponse')
const Review = require('../models/Review')
// @name    showReviews
// @desc    Show all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
exports.showReviews = AsyncHandler(async (request, response, next) => {
    if(request.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: request.params.bootcampId })
        return response.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    } else {
        response.status(200).json(response.AdvancedResults)
    }
})
// @name    showReview
// @desc    Show a single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.showReview = AsyncHandler(async(request, response, next) => {
    const review = await Review.findById(request.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })
    if(!review) return next(ErrorResponse(`Review with ID of ${request.params.id} not found.`, 404))
    response.status(200).json({
        success: true,
        data: review
    })
})
// @name    addReview
// @desc    Add a review
// @route   POST /api/v1/bootcamps/:bootcampId/reviews
// @access  Private
exports.addReview = AsyncHandler(async (request, response, next) => {
    request.body.bootcamp = request.params.bootcampId
    request.body.user = request.user.id
    const bootcamp = await Bootcamp.findById(request.params.bootcampId)
    if(!bootcamp) return next(ErrorResponse(`Bootcamp with ID of ${request.params.bootcampId} not found.`, 404))
    const review = await Review.create(request.body)
    response.status(200).json({
        success: true,
        data: review
    })
})
// @name    editReview
// @desc    Edit a review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.editReview = AsyncHandler(async (request, response, next) => {
    let review = await Review.findById(request.params.id)
    if(!review) return next(ErrorResponse(`Review with ID of ${request.params.id} not found.`, 404))
    // verify that user owns review or is an admin
    if(review.user.toString() !== request.user.id && request.user.role !== 'admin') return next(ErrorResponse('Not authorized.', 401))
    review = await Review.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true
    })
    response.status(200).json({
        success: true,
        data: review
    })
})
// @name    deleteReview
// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = AsyncHandler(async (request, response, next) => {
    const review = await Review.findById(request.params.id)
    if(!review) return next(ErrorResponse(`Review with ID of ${request.params.id} not found.`, 404))
    // verify that user owns review or is an admin
    if(review.user.toString() !== request.user.id && request.user.role !== 'admin') return next(ErrorResponse('Not authorized.', 401))
    await review.remove()
    response.status(200).json({ success: true })
})