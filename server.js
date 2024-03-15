import 'dotenv/config'
import path from 'path'
import express from "express"
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import hpp from 'hpp'
import rateLimit from 'express-rate-limit'
import ExpressMongoSanitize from 'express-mongo-sanitize'
import fileUpload from 'express-fileupload'
import morgan from 'morgan'
import connectToMongoDB from './utilities/connectToMongoDB.mjs'
import {notFound, errorHandler} from './middleware/errorHandler.mjs'
import bootcampsRouter from './routers/bootcampsRouter.mjs'
import coursesRouter from './routers/coursesRouter.mjs'
import reviewsRouter from './routers/reviewsRouter.mjs'
import usersRouter from './routers/usersRouter.mjs'
const MODE = process.env.NODE_ENV || 'production'
const PORT = process.env.PORT || 5000
connectToMongoDB()
const server = express()
server.use(express.static(path.join(path.dirname, 'public/images')))
server.use(morgan())
server.use(fileUpload)
server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use(cookieParser())
server.use(helmet())
server.use(helmet.xssFilter())
server.use(hpp())
server.use(ExpressMongoSanitize())
server.use(rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
}))
server.use('/api/bootcamps', bootcampsRouter)
server.use('/api/courses', coursesRouter)
server.use('/api/reviews', reviewsRouter)
server.use('/api/users', usersRouter)
server.use(notFound)
server.use(errorHandler)
server.listen(PORT, () => console.log(`Server running on localhost:${PORT} in ${MODE} mode.`))
export default server