import {Schema, model} from 'mongoose'
const courseSchema = new Schema({
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
        type: Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
})
courseSchema.statics.getAverageCost = async function(bootcampId) {
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
courseSchema.post('save', function() {
    this.constructor.getAverageCost(this.bootcamp)
})
courseSchema.pre('remove', function() {
    this.constructor.getAverageCost(this.bootcamp)
})
const courseModel = model('Course', courseSchema)
export default courseModel