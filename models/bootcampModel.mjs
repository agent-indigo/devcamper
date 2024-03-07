import {Schema, model} from 'mongoose'
import slugify from 'slugify'
import geoCoder from '../utilities/geoCoder.mjs'
const bootcampSchema = new Schema({
    name: {
        type: String,
        required: [
            true,
            'Please enter a name.'
        ],
        unique: true,
        trim: true,
    },
    slug: String,
    description: {
        type: String,
        required: [
            true,
            'Please enter a description.'
        ],
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+~#?&//=]*)/,
            'Please enter a valid HTTP or HTTPS URL.'
        ]
    },
    phone: {
        type: String,
        maxlength: [
            20,
            'Phone number must not exceed twenty characters.'
        ]
    },
    email: {
        type: String,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address.'
        ]
    },
    address: {
        type: String,
        required: [
            true,
            'Please enter an address'
        ]
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [
            1,
            'Rating must be from one to ten.'
        ],
        max: [
            10,
            'Rating must be from one to ten.'
        ]
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGI: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})
bootcampSchema.pre('save', function(next) {
    console.log('Slugify ran', this.name)
    this.slug = slugify(this.name, {lower: true})
    next()
})
bootcampSchema.pre('remove', async function(next) {
    console.log(`Courses being deleted from bootcamp ${this._id}.`)
    await this.model('Course').deleteMany({bootcamp: this._id})
    next()
})
bootcampSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false
})
bootcampSchema.pre('save', async function(next) {
    const location = await geoCoder.geocode(this.address)
    this.location = {
        type: 'Point',
        coordinates: [location[0].longitude, location[0].latitude],
        formattedAddress: location[0].formattedAddress,
        street: location[0].streetName,
        city: location[0].city,
        state: location[0].stateCode,
        zip: location[0].zipcode,
        country: location[0].countryCode
    }
    this.address = undefined
    next()
})
const bootcampModel = model('Bootcamp', bootcampSchema)
export default bootcampModel