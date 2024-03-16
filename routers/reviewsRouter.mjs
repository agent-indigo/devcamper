import {Router} from 'express'
import {
    showReviews,
    showReview,
    addReview,
    editReview,
    deleteReview
} from '../controllers/reviewsController.mjs'
import reviewModel from '../models/reviewModel,mjs'
import searchFilter from '../middleware/searchFilter.mjs'
import {isLoggedIn, isAdmin} from '../middleware/securityHandler.mjs'
const reviewsRouter = Router({mergeParams: true})
reviewsRouter.route('/').get(searchFilter(reviewModel, {
        path: 'bootcamp',
        select: 'name description'
    }),
    showReviews
).post(isLoggedIn, isAdmin('user', 'admin'), addReview)
reviewsRouter.route('/:id').get(showReview).put(isLoggedIn, isAdmin('user', 'admin'), editReview).delete(isLoggedIn, isAdmin('user', 'admin'), deleteReview)
export default reviewsRouter