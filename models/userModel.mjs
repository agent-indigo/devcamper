import {randomBytes, createHash} from 'crypto'
import {sign} from 'jsonwebtoken'
import {genSalt, hash, compare} from 'bcryptjs'
import {Schema, model} from 'mongoose'
const userSchema = new Schema({
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
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
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
    passwordResetToken: String,
    passwordExpiry: Date,
    createdOn: {
        type: Date,
        default: Date.now
    }
})
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) next()
    const salt = await genSalt(10)
    this.password = hash(this.password, salt)
})
userSchema.methods.getSignedJSONwebToken = function() {
    return sign(
        {id: this._id},
        process.env.JSON_WEB_TOKEN_SECRET,
        {expiresIn: process.env.JSON_WEB_TOKEN_EXPIRE}
    )
}
userSchema.methods.validatePassword = async function(enteredPassword) {
    return await compare(enteredPassword, this.password)
}
userSchema.methods.getPasswordResetToken = function() {
    const token = randomBytes(20).toString('hex')
    this.passwordResetToken = createHash('sha-256').update(token).digest('hex')
    this.passwordExpiry = Date.now() + 10 * 60 * 1000
    return token
}
const userModel = model('User', userSchema)
export default userModel