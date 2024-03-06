const AsyncHandler = require('../middleware/AsyncHandler')
const User = require('../models/User')
/**
 * @name    showUsers
 * @desc    Show all users
 * @route   GET /api/v1/users
 * @access  private/admin
 */
exports.showUsers = AsyncHandler(async (request, response, next) => {
    response.status(200).json(response.AdvancedResults)
})
/**
 * @name    showUser
 * @desc    Show a single user
 * @route   GET /api/v1/users/:id
 * @access  private/admin
 */
exports.showUser = AsyncHandler(async (request, response, next) => {
    const user = await User.findById(request.params.id)
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
exports.addUser = AsyncHandler(async (request, response, next) => {
    const user = await User.create(request.body)
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
exports.editUser = AsyncHandler(async (request, response, next) => {
    const user = await User.findByIdAndUpdate(request.params.id, request.body, {
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
exports.deleteUser = AsyncHandler(async (request, response, next) => {
    await User.findByIdAndDelete(request.params.id)
    response.status(200).json({ success: true })
})