const JSONwebToken = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            'Please provide a name'
        ]
    },
    email: {
        type: String,
        required: [
            true,
            'Please provide an email address.'
        ],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address.'
        ]
    },
    role: {
        type: String,
        enum: [
            'user',
            'publisher'
        ],
        default: 'user'
    },
    password: {
        type: String,
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdOn: {
        type: Date,
        default: Date.now
    }
})
// encrypt password
UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10)
    this.password = bcrypt.hash(this.password, salt)
})
// sign JSON web token and return
UserSchema.methods.getSignedJSONwebToken = function() {
    return JSONwebToken.sign(
        { id: this._id },
        process.env.JSON_WEB_TOKEN_SECRET,
        { expiresIn: process.env.JSON_WEB_TOKEN_EXPIRE }
    )
}
// verify password
UserSchema.methods.validatePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}
module.exports = mongoose.model('user',UserSchema)