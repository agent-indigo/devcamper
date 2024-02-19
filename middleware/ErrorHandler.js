const ErrorResponse = require('../utilities/ErrorResponse')
const ErrorHandler = (error, request, response, next) => {
    console.error(error.stack)
    // Mongoose bad ObjectID
    if(error.name === 'CastError') {
        const message = 'Resource not found.'
        error = ErrorResponse(message, 404)
    }
    // Mongoose duplicate key
    if(error.code === 11000) {
        const message = 'Duplicate field value entered'
        error = ErrorResponse(message, 400)
    }
    // Mongoose validation error
    if(error.name === 'ValidationError') {
        const message = Object.values(error.errors).map(value => value.message)
        error = ErrorResponse(message, 400)
    }
    response.status(error.statusCode || 500).json({
        success: false,
        error: error.message || '500 Internal Server Error'
    })
}
module.exports = ErrorHandler