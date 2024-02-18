const AsyncHandler = require('../middleware/AsyncHandler')
const crypto = require('crypto')
const ErrorResponse = require('../utilities/ErrorResponse')
const SendEmail = require('../utilities/SendEmail')
const User = require('../models/User')
// @name    register
// @desc    Register a new user
// @route   GET /api/v1/auth/register
// @access  Public
exports.register = AsyncHandler(async (request, response, next) => {
    const { name, email, password, role } = request.body
    // create user
    const user = await User.create({
        name,
        email,
        password,
        role
    })
    sendTokenResponse(user, 200, response)
})
// @name    login
// @desc    Log in a user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = AsyncHandler(async (request, response, next) => {
    const { email, password } = request.body
    // verify entry of email and password
    if(!email || !password) return next(ErrorResponse('Please provide an email address and password.', 404))
    // find user
    const user = await User.findOne({ email }).select('+password')
    if(!user) return next(ErrorResponse('Invalid credentials.', 401))
    // validate password
    const isValid = await user.validatePassword(password)
    if(isValid === false) return next(ErrorResponse('Invalid credentials.', 401))
    sendTokenResponse(user, 200, response)
})
// @name    getMe
// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
exports.getMe = AsyncHandler(async (request, response, next) => {
    const user = await User.findById(request.user.id)
    response.status(200).json({
        success: true,
        data: user
    })
})
// @name    editUser
// @desc    Edit user details
// @route   PATCH /api/v1/auth/editUser
// @access  Private
exports.editUser = AsyncHandler(async (request, response, next) => {
    const fieldsToUpdate = {
        name: request.body.name,
        email: request.body.email
    }
    const user = await User.findByIdAndUpdate(request.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    })
    response.status(200).json({
        success: true,
        data: user
    })
})
// @name    changePassword
// @desc    Change password
// @route   PATCH /api/v1/auth/changePassword
// @access  Private
exports.changePassword = AsyncHandler(async (request, response, next) => {
    const user = await User.findById(request.user.id).select('password')
    // check current password
    if(!(await user.validatePassword(request.body.currentPassword))) return next(ErrorResponse('Invalid password.', 401))
    user.password = request.body.newPassword
    await user.save()
    sendTokenResponse(user, 200, response)
})
// @name    forgotPassword
// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = AsyncHandler(async (request, response, next) => {
    const user = await User.findOne({ email: request.body.email })
    if(!user) return next(ErrorResponse(`User with email address ${request.body.email} not found.`, 404))
    const passwordResetToken = user.getPasswordResetToken()
    await user.save({ validateBeforeSave: false })
    // create password reset url
    const passwordResetURL = `${request.protocol}://${request.get('host')}/api/v1/auth/resetPassword/${passwordResetToken}`
    const message = `You have received this message because you (or someone else) has requested a password reset. Please visit\n\n${passwordResetURL}\n\nto reset your password.`
    try {
        await SendEmail({
            email: user.email,
            subject: 'Password reset',
            message
        })
        response.status(200).json({
            success: true,
            data: 'Password reset email sent.'
        })
    } catch(error) {
        console.error(error)
        user.passwordResetToken = undefined
        user.passwordResetExpiry = undefined
        await user.save({ validateBeforeSave: false })
        return next(ErrorResponse('Password reset email could not be sent.', 500))
    }
    response.status(200).json({
        success: true,
        data: user
    })
})
// @name    resetPassword
// @desc    Reset password
// @route   PATCH /api/v1/auth/resetPassword/:passwordResetToken
// @access  Public
exports.resetPassword = AsyncHandler(async (request, response, next) => {
    // get hashed token
    const passwordResetToken = crypto.createHash('sha256').update(request.params.passwordResetToken).digest('hex')
    const user = await User.findOne({
        passwordResetToken,
        passwordResetExpiry: { $gt: Date.now() }
    })
    if(!user) return next(ErrorResponse('Invalid token.', 400))
    // set new password
    user.password = request.body.password
    user.passwordResetToken = undefined
    user.passwordResetExpiry = undefined
    await user.save()
    sendTokenResponse(user, 200, response)
})
// get token from model, create cooke and send response
const sendTokenResponse = (user, statusCode, response) => {
    // create token
    const token = user.getSignedJSONwebToken()
    const options = {
        expires: new Date(Date.now() + process.env.JSON_WEB_TOKEN_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if(process.env.DEBUG === 'false') options.secure = true
    response.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    })
}