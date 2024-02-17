const mongoose = require('mongoose')
const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [
            true,
            'Please add a title.'
        ]
    },
    description: {
        type: String,
        required: [
            true,
            'Please add a description.'
        ]
    },
    weeks: {
        type: String,
        required: [
            true,
            'Please add a number of weeks.'
        ]
    },
    tuition: {
        type: Number,
        required: [
            true,
            'Please add a truition cost.'
        ]
    },
    minimumSkill: {
        type: String,
        required: [
            true,
            'Please add a minimum skill level.'
        ],
        enum: [
            'beginner',
            'intermediate',
            'advanced'
        ]
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
})
// static method to get average course tuitions
CourseSchema.statics.getAverageCost = async function(bootcampId) {
    const objectArray = await this.aggregate([
        {
            $match: {
                bootcamp: bootcampId
            }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: {
                    $avg: '$tuition'
                }
            }
        }
    ])
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(objectArray[0].averageCost / 10) * 10
        })
    } catch(error) {
        console.error(error)
    }
}
// calculate average cost after save
CourseSchema.post('save', function() {
    this.constructor.getAverageCost(this.bootcamp)
})
// calculate average cost before delete
CourseSchema.pre('remove', function() {
    this.constructor.getAverageCost(this.bootcamp)
})
module.exports = mongoose.model('Course', CourseSchema)