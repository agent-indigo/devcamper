import {Schema, model} from 'mongoose'
const reviewSchema = new Schema({
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
        type: Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})
reviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true })
reviewSchema.statics.getAverageRating = async function(bootcampId) {
    const objectArray = await this.aggregate([
        {
            $match: {bootcamp: bootcampId}
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: {$avg: '$rating'}
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
reviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.bootcamp)
})
reviewSchema.pre('remove', function() {
    this.constructor.getAverageRating(this.bootcamp)
})
const reviewModel = model('Review', reviewSchema)
export default reviewModel