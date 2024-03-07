import {createHash} from 'crypto'
import asyncHandler from '../middleware/asyncHandler.mjs'
import userModel from '../models/userModel.mjs'
import sendEmail from '../utilities/sendEmail.mjs'
// helper method for sending token responses
const sendTokenResponse = (user, statusCode, response) => {
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
/**
 * @name    register
 * @desc    Register a new user
 * @route   GET /api/v1/auth/register
 * @access  public
 */
export const register = asyncHandler(async (request, response, next) => {
    const {name, email, password, role} = request.body
    const user = await userModel.create({
        name,
        email,
        password,
        role
    })
    sendTokenResponse(user, 200, response)
})
/**
 * @name    login
 * @desc    Log in a user
 * @route   POST /api/v1/auth/login
 * @access  public
 */
export const login = asyncHandler(async (request, response, next) => {
    const {email, password} = request.body
    if(!email || !password) throw new Error('Please provide an email address and password.')
    const user = await userModel.findOne({email}).select('+password')
    if(!user) throw new Error('Invalid credentials.')
    const isValid = await user.validatePassword(password)
    if(isValid === false) throw new Error('Invalid credentials.')
    sendTokenResponse(user, 200, response)
})
/**
 * @name    logout
 * @desc    Log out the current user
 * @route   GET /api/v1/auth/logout
 * @access  private
 */
export const logout = asyncHandler(async (request, response, next) => {
    response.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    response.status(200).json({ success: true })
})
/**
 * @name    showProfile
 * @desc    Display current user's profile
 * @route   POST /api/v1/auth/me
 * @access  private
 */
export const showProfile = asyncHandler(async (request, response, next) => {
    const user = await userModel.findById(request.user.id)
    response.status(200).json({
        success: true,
        data: user
    })
})
/**
 * @name    editProfile
 * @desc    Edit current user's profile
 * @route   PUT /api/v1/auth/editUser
 * @access  private
 */
export const editProfile = asyncHandler(async (request, response, next) => {
    const fieldsToUpdate = {
        name: request.body.name,
        email: request.body.email
    }
    const user = await userModel.findByIdAndUpdate(request.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    })
    response.status(200).json({
        success: true,
        data: user
    })
})
/**
 * @name    changePassword
 * @desc    Change password
 * @route   PUT /api/v1/auth/changePassword
 * @access  private
 */
export const changePassword = asyncHandler(async (request, response, next) => {
    const user = await userModel.findById(request.user.id).select('password')
    if(!(await user.validatePassword(request.body.currentPassword))) throw new Error('Invalid password.')
    user.password = request.body.newPassword
    await user.save()
    sendTokenResponse(user, 200, response)
})
/**
 * @name    forgotPassword
 * @desc    Forgot password
 * @route   POST /api/v1/auth/forgotPassword
 * @access  public
 */
export const forgotPassword = asyncHandler(async (request, response, next) => {
    const user = await userModel.findOne({email: request.body.email})
    if(!user) throw new Error(`User with email address ${request.body.email} not found.`)
    const passwordResetToken = user.getPasswordResetToken()
    await user.save({validateBeforeSave: false})
    const passwordResetURL = `${request.protocol}://${request.get('host')}/api/v1/auth/resetPassword/${passwordResetToken}`
    const message = `You have received this message because you (or someone else) has requested a password reset. Please visit\n\n${passwordResetURL}\n\nto reset your password.`
    try {
        await sendEmail({
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
        await user.save({validateBeforeSave: false})
        throw new Error('Password reset email could not be sent.')
    }
    response.status(200).json({
        success: true,
        data: user
    })
})
/**
 * @name    resetPassword
 * @desc    Reset password
 * @route   PUT /api/v1/auth/resetPassword/:passwordResetToken
 * @access  public
 */
export const resetPassword = asyncHandler(async (request, response, next) => {
    const passwordResetToken = createHash('sha256').update(request.params.passwordResetToken).digest('hex')
    const user = await userModel.findOne({
        passwordResetToken,
        passwordResetExpiry: {$gt: Date.now()}
    })
    if(!user) throw new Error('Invalid token.')
    user.password = request.body.password
    user.passwordResetToken = undefined
    user.passwordResetExpiry = undefined
    await user.save()
    sendTokenResponse(user, 200, response)
})
/**
 * @name    showUsers
 * @desc    Show all users
 * @route   GET /api/v1/users
 * @access  private/admin
 */
export const showUsers = asyncHandler(async (request, response, next) => {
    response.status(200).json(response.AdvancedResults)
})
/**
 * @name    showUser
 * @desc    Show a single user
 * @route   GET /api/v1/users/:id
 * @access  private/admin
 */
export const showUser = asyncHandler(async (request, response, next) => {
    const user = await userModel.findById(request.params.id)
    response.status(200).json({
        success: true,
        data: user
    })
})
/**
 * @name    addUser
 * @desc    Add a new user
 * @route   POST /api/v1/users
 * @access  private/admin
 */
export const addUser = asyncHandler(async (request, response, next) => {
    const user = await userModel.create(request.body)
    response.status(201).json({
        success: true,
        data: user
    })
})
/**
 * @name    editUser
 * @desc    Edit a user
 * @route   PUT /api/v1/users/:id
 * @access  private/admin
 */
export const editUser = asyncHandler(async (request, response, next) => {
    const user = await userModel.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true
    })
    response.status(200).json({
        success: true,
        data: user
    })
})
/**
 * @name    deleteUser
 * @desc    Delete a user
 * @route   DELETE /api/v1/users/:id
 * @access  private/admin
 */
export const deleteUser = asyncHandler(async (request, response, next) => {
    await userModel.findByIdAndDelete(request.params.id)
    response.status(200).json({success: true})
})