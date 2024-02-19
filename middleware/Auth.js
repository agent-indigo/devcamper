const JSONwebToken = require('jsonwebtoken')
const AsyncHandler = require('./AsyncHandler')
const ErrorResponse = require('../utilities/ErrorResponse')
const User = require('../models/User')
exports.protect = AsyncHandler(async (request, response, next) => {
    let token
    if(request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
        // set token from bearer token in header
        token = request.headers.authorization.split(' ')[1]
    }
    else if(request.cookies.token) {
        // set token from cookie
        token = request.cookies.token
    }
    // ensure token exists
    if(!token) return next(ErrorResponse('Unauthorized.', 401))
    try {
        // verify token
        const decoded = JSONwebToken.verify(token, process.env.JSON_WEB_TOKEN_SECRET)
        request.user = await User.findById(decoded.id)
        next()
    } catch(error) {
        return next(ErrorResponse('Unauthorized.', 401))
    }
})
// grant role access
exports.authorize = (...roles) => {
    return (request, response, next) => {
        if(!roles.includes(request.user.role)) return next(ErrorResponse('Unauthorized.', 403))
        next()
    }
}