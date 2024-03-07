import 'dotenv/config'
import errorMessage from '../utilities/errorMessage.mjs'
export const notFound = (request, response, next) => {
    response.status(404)
    next(errorMessage(`${request.originalUrl} not found.`, 404))
}
export const errorHandler = (error, request, response, next) => {
    const MODE = process.env.NODE_ENV || 'production'
    console.error(error.stack)
    if(error.name === 'CastError' && error.kind === 'ObjectId') {
        error.message = errorMessage('Resource not found.', 404)
    } else if(error.code === 11000) {
        error.message = errorMessage('Duplicate field value entered.', 400)
    } else if(error.name === 'ValidationError') {
        error.message = errorMessage(Object.values(error.errors).map(value => value.message), 400)
    }
    response.status(error.statusCode || 500).json({
        success: false,
        error: error.message || '500 internal server error.',
        stack: MODE === 'production' ? null : error.stack
    })
}