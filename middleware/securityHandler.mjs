import 'dotenv/config'
import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.mjs'
import userModel from '../models/userModel.mjs'
export const isLoggedIn = asyncHandler(async (request, response, next) => {
    const token = request.cookies.jwt
    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            request.user = await userModel.findById(decoded.userId).select('-password')
            next()
        } catch(error) {
            console.error(error)
            response.status(401)
            throw new Error('Not authorized; token authentication failed.')
        }
    } else {
        response.status(401)
        throw new Error('Not authorized; no token.')
    }
})
export const isAdmin = async (request, response, next) => {
    await isLoggedIn(request, response, next)
    if(request.user && request.user.isAdmin) {
        next()
    } else {
        response.status(401)
        throw new Error('You are not logged in as an administrator.')
    }
}