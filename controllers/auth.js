const AsyncHandler = require('../middleware/AsyncHandler')
const ErrorResponse = require('../utilities/ErrorResponse')
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