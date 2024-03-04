const express = require('express')
const {
    showReviews,
    showReview,
    addReview,
    editReview,
    deleteReview
} = require('../controllers/reviews')
const Review = require('../models/Review')
const router = express.Router({ mergeParams: true })
const AdvancedResults = require('../middleware/AdvancedResults')
const { protect, authorize } = require('../middleware/Auth')
router.route('/').get(AdvancedResults(Review, {
        path: 'bootcamp',
        select: 'name description'
    }),
    showReviews
).post(protect, authorize('user', 'admin'), addReview)
router.route('/:id').get(showReview).put(protect, authorize('user', 'admin'), editReview).delete(protect, authorize('user', 'admin'), deleteReview)
module.exports = router