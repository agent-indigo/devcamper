import 'dotenv/config'
import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.mjs'
import userModel from '../models/userModel.mjs'
export const isLoggedIn = asyncHandler(async (request, response, next) => {
    let token
    if(request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
        token = request.headers.authorization.split(' ')[1]
    }
    else if(request.cookies.token) {
        token = request.cookies.token
    }
    if(!token) return next(ErrorResponse('Unauthorized.', 401))
    try {
        const decoded = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET)
        request.user = await userModel.findById(decoded.id)
        next()
    } catch(error) {
        return next(ErrorResponse('Unauthorized.', 401))
    }
})
export const isAdmin = (...roles) => {
    return (request, response, next) => {
        if(!roles.includes(request.user.role)) return next(ErrorResponse('Unauthorized.', 403))
        next()
    }
}