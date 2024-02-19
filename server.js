// imports
const path = require('path')
const express = require('express')
const FileUpload = require('express-fileupload')
const dotenv = require('dotenv')
const morgan = require('morgan')
const helmet = require ('helmet')
const XSSclean = require('xss-clean')
const HPPguard = require('hpp')
const CORS = require('cors')
const RateLimiter = require('express-rate-limit')
const MongoSanitize = require('express-mongo-sanitize')
const CookieParser = require('cookie-parser')
const ConnectToMongoDB = require('./config/ConnectToMongoDB')
const ErrorHandler = require('./middleware/ErrorHandler')
// route files
const auth = require('./routes/auth')
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const reviews = require('./routes/reviews')
const users = require('./routes/users')
// load environment variables
dotenv.config({ path: './config/config.env' })
// connect to MongoDB
ConnectToMongoDB()
// create server
const app = express()
// body parser
app.use(express.json())
// cookie parser
app.use(CookieParser)
// environment variables
const DEBUG = process.env.DEBUG || 'false'
const PORT = process.env.PORT || 5000
// development logger: "Morgan"
if(DEBUG !== 'false') app.use(morgan('dev'))
// file uploading
app.use(FileUpload())
// sanitize data
app.use(MongoSanitize())
// set security headers
app.use(helmet())
// prevent XSS attacks
app.use(XSSclean())
// prevent HTTP pollution
app.use(HPPguard())
// set ten minute rate limit
const rateLimit = RateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 100
})
app.use(rateLimit)
// enable CORS
app.use(CORS())
// set static folder
app.use(express.static(path.join(__dirname, 'public')))
// mount routers
app.use('/api/v1/auth', auth)
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/reviews', reviews)
app.use('/api/v1/users', users)
// error handler
app.use(ErrorHandler)
// start server
const server = app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}.`)
    if(DEBUG !== 'false') console.log('Debug mode enabled.')
})
// handle promise rejections
process.on('unhandledRejection', (error, promise) => {
    console.error(`Error: ${error.message}`)
    // close server & exit process
    server.close(() => process.exit(1))
})