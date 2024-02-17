// imports
const path = require('path')
const express = require('express')
const fileUpload = require('express-fileupload')
const dotenv = require('dotenv')
const morgan = require('morgan')
const CookieParser = require('cookie-parser')
const ConnectToMongoDB = require('./config/ConnectToMongoDB')
const ErrorHandler = require('./middleware/ErrorHandler')
// route files
const auth = require('./routes/auth')
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
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
app.use(fileUpload())
// set static folder
app.use(express.static(path.join(__dirname, 'public')))
// mount routers
app.use('/api/v1/auth', auth)
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
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