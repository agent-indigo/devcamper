import asyncHandler from '../middleware/asyncHandler.mjs'
import bootcampModel from '../models/bootcampModel.mjs'
import reviewModel from '../models/reviewModel.mjs'
/**
 * @name    showReviews
 * @desc    Show all reviews
 * @routes  GET /api/v1/reviews, GET /api/v1/bootcamps/:bootcampId/reviews
 * @access  public
 */
export const showReviews = asyncHandler(async (request, response, next) => {
    if(request.params.bootcampId) {
        const reviews = await reviewModel.find({bootcamp: request.params.bootcampId})
        return response.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    } else {
        response.status(200).json(response.AdvancedResults)
    }
})
/**
 * @name    showReview
 * @desc    Show a single review
 * @route   GET /api/v1/reviews/:id
 * @access  public
 */
export const showReview = asyncHandler(async(request, response, next) => {
    const review = await reviewModel.findById(request.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })
    if(!review) throw new Error(`Review with ID of ${request.params.id} not found.`)
    response.status(200).json({
        success: true,
        data: review
    })
})
/**
 * @name    addReview
 * @desc    Add a review
 * @route   POST /api/v1/bootcamps/:bootcampId/reviews
 * @access  private
 */
export const addReview = asyncHandler(async (request, response, next) => {
    request.body.bootcamp = request.params.bootcampId
    request.body.user = request.user.id
    const bootcamp = await bootcampModel.findById(request.params.bootcampId)
    if(!bootcamp) throw new Error(`Bootcamp with ID of ${request.params.bootcampId} not found.`)
    const review = await reviewModel.create(request.body)
    response.status(200).json({
        success: true,
        data: review
    })
})
/**
 * @name    editReview
 * @desc    Edit a review
 * @route   PUT /api/v1/reviews/:id
 * @access  private
 */
export const editReview = asyncHandler(async (request, response, next) => {
    let review = await reviewModel.findById(request.params.id)
    if(!review) throw new Error(`Review with ID of ${request.params.id} not found.`)
    if(review.user.toString() !== request.user.id && request.user.role !== 'admin') throw new Error('Not authorized.')
    review = await reviewModel.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true
    })
    response.status(200).json({
        success: true,
        data: review
    })
})
/**
 * @name    deleteReview
 * @desc    Delete a review
 * @route   DELETE /api/v1/reviews/:id
 * @access  private
 */
export const deleteReview = asyncHandler(async (request, response, next) => {
    const review = await reviewModel.findById(request.params.id)
    if(!review) throw new Error(`Review with ID of ${request.params.id} not found.`)
    if(review.user.toString() !== request.user.id && request.user.role !== 'admin') throw new Error('Not authorized.')
    await review.remove()
    response.status(200).json({success: true})
})