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
reviewsRouter.get('/', searchFilter(reviewModel, {
    path: 'bootcamp',
    select: 'name description'
}), showReviews)
reviewsRouter.get('/:id', showReview)
reviewsRouter.use(isLoggedIn)
reviewsRouter.use(isAdmin('user', 'admin'))
reviewsRouter.post('/', addReview)
reviewsRouter.put('/:id', editReview)
reviewsRouter.delete('/:id', deleteReview)
export default reviewsRouter