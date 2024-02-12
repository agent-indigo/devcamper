const mongoose = require('mongoose')
const slugify = require('slugify')
const BootcampSchema = new mongoose.Schema({
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
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+~#?&//=]*)/,
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
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
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
        //GeoJSON Point
        type: {
            type: String,
            enum: ['Point'],
            // required: true
        },
        coordinates: {
            type: [Number],
            // required: true,
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
        // arrary of strings
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
        min: [1, 'Rating must be from one to ten.'],
        max: [10, 'Rating must be from one to ten.']
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
    }
})
// create slug from name
BootcampSchema.pre('save', function(next) {
    console.log('Slugify ran', this.name)
    this.slug = slugify(this.name, { lower: true })
    next()
})
module.exports = mongoose.model('Bootcamp', BootcampSchema)