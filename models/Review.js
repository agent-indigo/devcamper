const mongoose = require('mongoose')
const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [
            true,
            'Please add a title.'
        ],
        maxlength: 100
    },
    text: {
        type: String,
        required: [
            true,
            'Text field is empty.'
        ]
    },
    rating: {
        type: Number,
        min: [
            1,
            'Rating must be from one to ten.'
        ],
        max: [
            10,
            'Rating must be from one to ten.'
        ],
        required: [
            true,
            'Please add a rating.'
        ]
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})
// limit user to one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true })
// static method to get the average rating
ReviewSchema.statics.getAverageRating = async function(bootcampId) {
    const objectArray = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: { $avg: '$rating' }
            }
        }
    ])
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: objectArray[0].averageRating
        })
    } catch(error) {
        console.error(error)
    }
}
// call getAverageRating after save
ReviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.bootcamp)
})
// call getAverageRating before remove
ReviewSchema.pre('remove', function() {
    this.constructor.getAverageRating(this.bootcamp)
})
module.exports = mongoose.model('Review', ReviewSchema)